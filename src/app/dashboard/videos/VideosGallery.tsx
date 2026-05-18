"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/icons";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ProcessingVideoPlaceholder } from "@/components/loading/ProcessingVideoCard";

type Video = {
  _id: string;
  title?: string;
  status: string;
  playbackUrl?: string;
  finalVideoUrl?: string;
  errorMessage?: string;
  _creationTime: number;
};

function canPlay(playbackUrl?: string) {
  return Boolean(playbackUrl);
}

export function VideosGallery({ videos: initial }: { videos: Video[] }) {
  const [videos, setVideos] = useState(initial);
  const [search, setSearch] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      videos.filter((v) =>
        (v.title ?? "Untitled").toLowerCase().includes(search.toLowerCase())
      ),
    [videos, search]
  );

  const previewVideo = previewId
    ? videos.find((v) => v._id === previewId)
    : null;

  const handleDelete = async (videoId: string) => {
    if (!confirm("Delete this video?")) return;
    setDeletingId(videoId);
    try {
      const res = await fetch(`/api/videos/${videoId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      setVideos((v) => v.filter((x) => x._id !== videoId));
      if (previewId === videoId) setPreviewId(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const openDownload = (videoId: string) => {
    window.location.assign(`/api/videos/${videoId}/playback?download=1`);
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="mb-2 font-headline text-2xl font-extrabold text-foreground sm:text-3xl">
            My Videos
          </h1>
          <p className="text-muted-foreground">{videos.length} videos created</p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-[0_0_15px_rgba(209,255,0,0.3)] transition-transform hover:scale-105 sm:w-auto"
        >
          <AppIcon name="add_circle" size="md" />
          Create Video
        </Link>
      </div>

      <div className="relative">
        <AppIcon
          name="search"
          size="md"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-16 text-center">
          <p className="text-muted-foreground mb-4">No videos found</p>
          <Link href="/dashboard/create" className="text-primary font-bold">
            Create your first video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video) => {
            const playable = canPlay(video.playbackUrl);

            return (
              <div
                key={video._id}
                className={`bg-surface rounded-2xl border border-border overflow-hidden transition-opacity ${
                  deletingId === video._id ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="aspect-video bg-black relative group">
                  {playable ? (
                    <>
                      <VideoPlayer
                        videoId={video._id}
                        title={video.title}
                        className="w-full h-full object-contain bg-black"
                        preview
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewId(video._id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Play video"
                      >
                        <span className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                          <AppIcon name="play_arrow" size="xl" />
                        </span>
                      </button>
                    </>
                  ) : (
                    <ProcessingVideoPlaceholder status={video.status} />
                  )}
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded-full text-xs font-bold uppercase">
                    {video.status}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold truncate">
                    {video.title ?? "Untitled Ad"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(video._creationTime).toLocaleDateString()}
                  </p>
                  {video.errorMessage && (
                    <p className="text-xs text-red-400 line-clamp-2">
                      {video.errorMessage}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {playable && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPreviewId(video._id)}
                          className="flex-1 py-2 text-sm font-semibold bg-white/5 border border-border rounded-lg hover:bg-white/10"
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => openDownload(video._id)}
                          className="flex-1 py-2 text-sm font-bold text-center bg-primary text-primary-foreground rounded-lg"
                        >
                          Download
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      disabled={deletingId === video._id}
                      onClick={() => handleDelete(video._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg border border-border disabled:opacity-50"
                      title="Delete"
                    >
                      <AppIcon name="delete" size="lg" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewVideo && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-black/90 p-4 sm:p-6"
          onClick={() => setPreviewId(null)}
          onKeyDown={(e) => e.key === "Escape" && setPreviewId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="my-auto w-full max-w-4xl min-w-0 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-white">
              <h2 className="font-bold truncate pr-4">
                {previewVideo.title ?? "Video preview"}
              </h2>
              <button
                type="button"
                onClick={() => setPreviewId(null)}
                className="p-2 rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                <AppIcon name="close" size="md" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
              <VideoPlayer
                videoId={previewVideo._id}
                title={previewVideo.title}
                className="w-full h-full object-contain"
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
