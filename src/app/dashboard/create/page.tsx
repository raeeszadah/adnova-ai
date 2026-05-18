"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { InsufficientCreditsBanner } from "@/components/credits/InsufficientCreditsBanner";
import { DEFAULT_AVATARS, DEFAULT_VOICES } from "@/lib/defaults";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AppIcon } from "@/components/icons";
import {
  VideoGenerationProgress,
  type GenerationPhase,
} from "@/components/loading/VideoGenerationProgress";

type Avatar = {
  avatar_id: string;
  avatar_name?: string;
  preview_image_url?: string;
  gender?: string;
};

type Voice = {
  voice_id: string;
  name?: string;
  language?: string;
  gender?: string;
};

export default function CreateVideoWizard() {
  const router = useRouter();
  const { userId } = useAuth();
  const userData = useQuery(
    api.users.getUserWithVideos,
    userId ? { clerkId: userId } : "skip"
  );
  const credits = userData?.credits ?? 0;
  const outOfCredits = credits < 1;
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState("");
  const [videoId, setVideoId] = useState<Id<"videos"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const [avatars, setAvatars] = useState<Avatar[]>(DEFAULT_AVATARS);
  const [voices, setVoices] = useState<Voice[]>(DEFAULT_VOICES);
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0].avatar_id);
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICES[0].voice_id);
  const [warning, setWarning] = useState<string | null>(null);
  const [genPhase, setGenPhase] = useState<GenerationPhase>("script");
  const [genProgress, setGenProgress] = useState(0);

  const selectedAvatarData = avatars.find((a) => a.avatar_id === selectedAvatar);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, vRes] = await Promise.all([
          fetch("/api/heygen/avatars"),
          fetch("/api/heygen/voices"),
        ]);
        if (aRes.ok) {
          const aData = await aRes.json();
          const avs: Avatar[] = aData.avatars ?? [];
          if (avs.length > 0) {
            setAvatars(avs);
            setSelectedAvatar(avs[0].avatar_id);
          }
        }
        if (vRes.ok) {
          const vData = await vRes.json();
          const vcs: Voice[] = vData.voices ?? [];
          if (vcs.length > 0) {
            setVoices(vcs);
            setSelectedVoice(vcs[0].voice_id);
          }
        }
      } catch {
        /* keep defaults */
      }
    };
    load();
  }, []);

  const handleGenerateScript = async () => {
    if (!imageFile) return;
    if (outOfCredits) {
      setError("Insufficient credits. Upgrade your plan or buy credits to continue.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setWarning(null);
    setGenPhase("script");
    setGenProgress(8);
    try {
      const uploadForm = new FormData();
      uploadForm.append("file", imageFile);
      const uploadRes = await fetch("/api/upload/product", {
        method: "POST",
        body: uploadForm,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok)
        throw new Error(uploadData.error ?? "Failed to upload product image");

      const createRes = await fetch("/api/videos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          productImageUrl: uploadData.productImageUrl,
          productStorageId: uploadData.productStorageId,
          avatarId: selectedAvatar,
          voiceId: selectedVoice,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok)
        throw new Error(createData.error ?? "Failed to create video project");

      const newVideoId = createData.videoId as Id<"videos">;
      setVideoId(newVideoId);

      const scriptRes = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoId: newVideoId,
          avatarId: selectedAvatar,
          voiceId: selectedVoice,
        }),
      });
      const scriptData = await scriptRes.json();
      if (!scriptRes.ok)
        throw new Error(scriptData.error ?? "Failed to generate script");

      setScript(scriptData.script);
      setGenProgress(18);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const pollHeyGenUntilReady = async (
    heygenVideoId: string,
    maxMinutes = 15
  ): Promise<string> => {
    const deadline = Date.now() + maxMinutes * 60 * 1000;
    let pollCount = 0;
    while (Date.now() < deadline) {
      pollCount += 1;
      const res = await fetch(
        `/api/heygen/video-status?heygenVideoId=${encodeURIComponent(heygenVideoId)}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to check HeyGen status");
      }
      if (data.status === "completed" && data.videoUrl) {
        return data.videoUrl as string;
      }
      if (data.status === "failed") {
        throw new Error(data.error ?? "HeyGen avatar generation failed");
      }
      setStatusMessage(
        `HeyGen is rendering your avatar (${data.status ?? "processing"})… usually 3–10 minutes.`
      );
      setGenProgress((p) => Math.min(72, 38 + pollCount * 3));
      await new Promise((r) => setTimeout(r, 5_000));
    }
    throw new Error(
      "HeyGen is still rendering after 15 minutes. Check My Videos later or try a shorter script."
    );
  };

  const handleGenerateVideo = async () => {
    if (!videoId) {
      setError("No video project found. Please start from step 1.");
      return;
    }
    if (outOfCredits) {
      setError("Insufficient credits. Upgrade your plan or buy credits to continue.");
      return;
    }
    setStep(3);
    setError(null);
    setWarning(null);
    setGenPhase("avatar");
    setGenProgress(22);

    try {
      setStatusMessage("Starting HeyGen avatar render…");
      const avatarRes = await fetch("/api/generate/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          videoId,
          avatarId: selectedAvatar,
          voiceId: selectedVoice,
        }),
      });
      const avatarData = await avatarRes.json();
      if (!avatarRes.ok) {
        throw new Error(avatarData.error ?? "Avatar generation failed");
      }
      if (avatarData.warning) {
        setWarning(avatarData.warning);
      }

      let avatarVideoUrl = avatarData.avatarVideoUrl as string | undefined;
      if (!avatarVideoUrl && avatarData.status === "processing") {
        setGenPhase("heygen");
        setGenProgress(35);
        avatarVideoUrl = await pollHeyGenUntilReady(
          avatarData.heygenVideoId as string
        );
      } else {
        setGenPhase("compose");
        setGenProgress(55);
      }
      if (!avatarVideoUrl) {
        throw new Error("No avatar video URL from HeyGen");
      }

      setGenPhase("compose");
      setGenProgress(78);
      setStatusMessage(
        "Downloading avatar clip, then rendering final ad (this is faster than before)…"
      );
      const composeRes = await fetch("/api/generate/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          avatarVideoUrl,
          scriptText: script,
        }),
      });
      const composeData = await composeRes.json();
      if (!composeRes.ok) {
        throw new Error(composeData.error ?? "Video composition failed");
      }

      setGenPhase("finalize");
      setGenProgress(96);
      setFinalVideoUrl(composeData.finalUrl);
      setGenProgress(100);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Video generation failed");
      setStep(2);
    }
  };

  const stepIndicator = (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {[
        { num: 1, label: "Product Details" },
        { num: 2, label: "Review Script" },
        { num: 3, label: "Processing" },
        { num: 4, label: "Video Ready" },
      ].map((s, idx) => (
        <div key={s.num} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s.num
                ? "bg-primary text-primary-foreground"
                : "bg-surface border border-border text-muted-foreground"
            }`}
          >
            {step > s.num ? (
              <AppIcon name="check" size="sm" />
            ) : (
              s.num
            )}
          </div>
          <span
            className={`text-sm hidden sm:inline ${step >= s.num ? "font-bold" : "text-muted-foreground"}`}
          >
            {s.label}
          </span>
          {idx < 3 && (
            <div
              className={`w-8 h-px ${step > s.num ? "bg-primary" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-foreground mb-2">
          Create Video Ad
        </h1>
        <p className="text-muted-foreground">
          Generate a professional video ad for your product
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}
      {warning && !error && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 px-4 py-3 rounded-xl text-sm">
          {warning}
        </div>
      )}

      {stepIndicator}

      <InsufficientCreditsBanner credits={credits} />

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <h2 className="text-base font-bold">Product Details</h2>
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/5 border border-border rounded-xl p-3 focus:outline-none focus:border-primary"
                  placeholder="e.g. Smart Watch Pro X"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Product Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-black/5 border border-border rounded-xl p-3 focus:outline-none focus:border-primary resize-none"
                  placeholder="Features, benefits, target audience..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Product Image
                </label>
                <label className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-white/5 w-full">
                  <AppIcon name="cloud_upload" size="xl" className="mb-1 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {imageFile ? imageFile.name : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5">
              <h2 className="text-base font-bold mb-3">Select Avatar</h2>
              <div className="grid grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1">
                {avatars.map((av) => {
                  const isSelected = selectedAvatar === av.avatar_id;
                  const imgUrl = av.preview_image_url;
                  return (
                    <button
                      key={av.avatar_id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.avatar_id)}
                      className={`relative rounded-xl border-2 p-2 text-left transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={av.avatar_name ?? "Avatar"}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-20 bg-black/20 rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                          {av.avatar_name?.[0] ?? "?"}
                        </div>
                      )}
                      <p className="text-xs font-semibold mt-2 truncate">
                        {av.avatar_name ?? av.avatar_id}
                      </p>
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <AppIcon name="check" size="sm" className="text-primary-foreground" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {voices.length > 0 && (
              <div className="bg-surface border border-border rounded-2xl p-5">
                <h2 className="text-base font-bold mb-3">Select Voice</h2>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-black/5 border border-border rounded-xl p-3"
                >
                  {voices.map((v) => (
                    <option key={v.voice_id} value={v.voice_id}>
                      {v.name ?? v.voice_id}
                      {v.language ? ` (${v.language})` : ""}
                      {v.gender ? ` - ${v.gender}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerateScript}
              disabled={isGenerating || !title || !description || !imageFile}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(209,255,0,0.25)]"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-bounce"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </span>
                  AI is writing your script…
                </span>
              ) : (
                <>
                  <AppIcon name="auto_awesome" size="md" />
                  Generate Script with AI
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-surface border border-border rounded-2xl p-6 min-h-[320px] flex flex-col">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Video preview
              </p>
              <div className="flex-1 flex items-center justify-center rounded-xl bg-black/30 border border-dashed border-border min-h-[200px]">
                <p className="text-muted-foreground text-sm">
                  Final video preview appears after generation
                </p>
              </div>
            </div>

            {selectedAvatarData && (
              <div className="bg-surface border border-border rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Selected avatar
                </p>
                <div className="flex gap-4 items-center">
                  {selectedAvatarData.preview_image_url ? (
                    <img
                      src={selectedAvatarData.preview_image_url}
                      alt={selectedAvatarData.avatar_name ?? "Avatar"}
                      className="w-24 h-24 rounded-xl object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-black/30 flex items-center justify-center">
                      <AppIcon name="person" size="2xl" className="text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-bold">
                      {selectedAvatarData.avatar_name ?? selectedAvatar}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAvatarData.gender ?? "Avatar"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {step >= 2 && (
        <div className="bg-surface border border-border p-8 rounded-3xl shadow-lg max-w-3xl mx-auto">
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Review AI Script</h2>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-64 bg-black/5 border border-border rounded-xl p-4 text-lg leading-relaxed"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 rounded-xl font-bold border border-border hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleGenerateVideo}
                  className="w-2/3 bg-primary text-primary-foreground py-4 rounded-xl font-bold"
                >
                  Generate Final Video
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8">
              <VideoGenerationProgress
                phase={genPhase}
                progress={genProgress}
                statusMessage={statusMessage}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold text-primary">Video Ready!</h2>
              <div className="aspect-video bg-black/50 border border-border rounded-2xl overflow-hidden">
                {videoId ? (
                  <VideoPlayer
                    videoId={videoId}
                    className="w-full h-full object-contain bg-black"
                    autoPlay
                  />
                ) : (
                  <video
                    src={finalVideoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/videos")}
                  className="flex-1 py-4 rounded-xl font-bold border border-border"
                >
                  My Videos
                </button>
                {videoId ? (
                  <a
                    href={`/api/videos/${videoId}/playback?download=1`}
                    className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2"
                  >
                    <AppIcon name="download" size="md" />
                    Download
                  </a>
                ) : (
                  <a
                    href={finalVideoUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2"
                  >
                    <AppIcon name="download" size="md" />
                    Download
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
