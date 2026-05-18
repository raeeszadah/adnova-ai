const HEYGEN_BASE = "https://api.heygen.com";

export type HeyGenResult = {
  avatarVideoUrl?: string;
  videoId: string;
  /** HeyGen job still rendering — poll with fetchHeyGenVideoStatus */
  status?: "processing" | "completed";
  mockFallback?: boolean;
  warning?: string;
};

export type HeyGenAvatar = {
  avatar_id: string;
  avatar_name?: string;
  preview_image_url?: string;
  gender?: string;
};

export type HeyGenVoice = {
  voice_id: string;
  name?: string;
  language?: string;
  gender?: string;
};

export type HeyGenVideoStatus = {
  status: string;
  videoUrl?: string;
  error?: string;
};

function formatHeyGenError(error: unknown): string {
  if (!error) return "HeyGen video generation failed";
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    const e = error as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    if (typeof e.detail === "string") return e.detail;
    if (typeof e.msg === "string") return e.msg;
    try {
      return JSON.stringify(error);
    } catch {
      return "HeyGen video generation failed";
    }
  }
  return String(error);
}

const MOCK_AVATAR_URL =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const AVATAR_PRESETS: HeyGenAvatar[] = [
  {
    avatar_id: "preset_sarah",
    avatar_name: "Sarah (Demo)",
    preview_image_url:
      "https://images.unsplash.com/photo-1609371497456-3a55a205d5eb?w=200&h=200&fit=crop",
  },
  {
    avatar_id: "preset_elena",
    avatar_name: "Elena (Demo)",
    preview_image_url:
      "https://images.unsplash.com/photo-1715882389866-85c647489319?w=200&h=200&fit=crop",
  },
];

let cachedAvatarId: string | null = null;
let cachedVoiceId: string | null = null;

function getApiKey() {
  return process.env.HEYGEN_API_KEY;
}

function heygenHeaders(apiKey: string) {
  return {
    "X-Api-Key": apiKey,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function allowMockOnFailure(): boolean {
  return process.env.HEYGEN_ALLOW_MOCK_FALLBACK === "true";
}

export async function listHeyGenAvatars(): Promise<HeyGenAvatar[]> {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === "placeholder") {
    return AVATAR_PRESETS;
  }

  try {
    const res = await fetch(`${HEYGEN_BASE}/v2/avatars`, {
      headers: heygenHeaders(apiKey),
    });
    if (!res.ok) return AVATAR_PRESETS;
    const data = (await res.json()) as {
      data?: { avatars?: Record<string, unknown>[] };
    };
    const raw = data.data?.avatars ?? [];
    const avatars: HeyGenAvatar[] = raw
      .filter((a) => typeof a.avatar_id === "string")
      .slice(0, 24)
      .map((a) => ({
        avatar_id: a.avatar_id as string,
        avatar_name:
          (a.avatar_name as string) ??
          (a.name as string) ??
          "Avatar",
        preview_image_url:
          (a.preview_image_url as string) ??
          (a.preview_url as string) ??
          (a.image as string) ??
          "",
        gender:
          typeof a.gender === "string"
            ? (a.gender as string).charAt(0).toUpperCase() +
              (a.gender as string).slice(1)
            : undefined,
      }));
    return avatars.length > 0 ? avatars : AVATAR_PRESETS;
  } catch {
    return AVATAR_PRESETS;
  }
}

export async function listHeyGenVoices(): Promise<HeyGenVoice[]> {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === "placeholder") {
    return [{ voice_id: "demo_voice", name: "Demo Voice", language: "en" }];
  }

  try {
    const res = await fetch(`${HEYGEN_BASE}/v2/voices`, {
      headers: heygenHeaders(apiKey),
    });
    if (!res.ok) {
      return [{ voice_id: "demo_voice", name: "Default", language: "en" }];
    }
    const data = (await res.json()) as {
      data?: { voices?: Record<string, unknown>[] };
    };
    const voices: HeyGenVoice[] = (data.data?.voices ?? [])
      .filter((v) => typeof v.voice_id === "string")
      .slice(0, 40)
      .map((v) => ({
        voice_id: v.voice_id as string,
        name:
          (v.name as string) ??
          (v.display_name as string) ??
          (v.voice_id as string),
        language: (v.language as string) ?? "en",
        gender: (v.gender as string) ?? "",
      }));
    return voices.length > 0
      ? voices
      : [{ voice_id: "demo_voice", name: "Default", language: "en" }];
  } catch {
    return [{ voice_id: "demo_voice", name: "Default", language: "en" }];
  }
}

async function resolveHeyGenIds(
  apiKey: string,
  avatarId?: string,
  voiceId?: string
): Promise<{ avatarId: string; voiceId: string }> {
  if (avatarId && voiceId) {
    return { avatarId, voiceId };
  }

  const envAvatar = process.env.HEYGEN_AVATAR_ID;
  const envVoice = process.env.HEYGEN_VOICE_ID;
  if (envAvatar && envVoice) {
    return { avatarId: envAvatar, voiceId: envVoice };
  }

  if (cachedAvatarId && cachedVoiceId && !avatarId && !voiceId) {
    return { avatarId: cachedAvatarId, voiceId: cachedVoiceId };
  }

  const [avatars, voices] = await Promise.all([
    listHeyGenAvatars(),
    listHeyGenVoices(),
  ]);

  const resolvedAvatar =
    avatarId ??
    envAvatar ??
    avatars.find((a) => a.avatar_id && !a.avatar_id.startsWith("preset_"))
      ?.avatar_id ??
    avatars[0]?.avatar_id;
  const resolvedVoice =
    voiceId ?? envVoice ?? voices[0]?.voice_id;

  if (!resolvedAvatar || !resolvedVoice) {
    throw new Error(
      "No HeyGen avatar or voice available. Set HEYGEN_AVATAR_ID and HEYGEN_VOICE_ID in .env"
    );
  }

  if (!avatarId?.startsWith("preset_")) {
    cachedAvatarId = resolvedAvatar;
    cachedVoiceId = resolvedVoice;
  }

  return { avatarId: resolvedAvatar, voiceId: resolvedVoice };
}

/** Start a HeyGen render job; returns the HeyGen video_id to poll. */
export async function createHeyGenVideoJob(
  script: string,
  options?: { avatarId?: string; voiceId?: string }
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === "placeholder") {
    throw new Error("HEYGEN_API_KEY is not configured");
  }

  const { avatarId, voiceId } = await resolveHeyGenIds(
    apiKey,
    options?.avatarId,
    options?.voiceId
  );

  const width = Number(process.env.HEYGEN_VIDEO_WIDTH) || 720;
  const height = Number(process.env.HEYGEN_VIDEO_HEIGHT) || 1280;

  const createRes = await fetch(`${HEYGEN_BASE}/v2/video/generate`, {
    method: "POST",
    headers: heygenHeaders(apiKey),
    body: JSON.stringify({
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: avatarId,
            avatar_style: "normal",
          },
          voice: {
            type: "text",
            input_text: script,
            voice_id: voiceId,
          },
        },
      ],
      dimension: { width, height },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`HeyGen create failed: ${createRes.status} ${errText}`);
  }

  const createData = (await createRes.json()) as {
    data?: { video_id?: string };
    error?: unknown;
  };

  const videoId = createData.data?.video_id;
  if (!videoId) {
    throw new Error(
      formatHeyGenError(createData.error) ?? "HeyGen did not return a video_id"
    );
  }

  return videoId;
}

function parseStatusPayload(data: Record<string, unknown>): HeyGenVideoStatus {
  const block = (data.data ?? data) as Record<string, unknown>;
  const status = String(block.status ?? "processing");
  const videoUrl =
    (block.video_url as string) ??
    (block.videoUrl as string) ??
    undefined;
  const error = block.error
    ? formatHeyGenError(block.error)
    : block.msg
      ? formatHeyGenError(block.msg)
      : undefined;

  return { status, videoUrl, error };
}

/** Check HeyGen render status (v1 + v2 fallback). */
export async function fetchHeyGenVideoStatus(
  heygenVideoId: string
): Promise<HeyGenVideoStatus> {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === "placeholder") {
    return { status: "completed", videoUrl: MOCK_AVATAR_URL };
  }

  const v1Res = await fetch(
    `${HEYGEN_BASE}/v1/video_status.get?video_id=${encodeURIComponent(heygenVideoId)}`,
    { headers: { "X-Api-Key": apiKey } }
  );

  if (v1Res.ok) {
    const data = (await v1Res.json()) as Record<string, unknown>;
    return parseStatusPayload(data);
  }

  const v2Res = await fetch(`${HEYGEN_BASE}/v2/video/${heygenVideoId}`, {
    headers: heygenHeaders(apiKey),
  });

  if (!v2Res.ok) {
    throw new Error(`HeyGen status failed: ${v1Res.status} / ${v2Res.status}`);
  }

  const data = (await v2Res.json()) as Record<string, unknown>;
  return parseStatusPayload(data);
}

export async function waitForHeyGenVideo(
  heygenVideoId: string,
  options?: { maxWaitMs?: number; pollIntervalMs?: number }
): Promise<string> {
  const maxWaitMs = options?.maxWaitMs ?? 15 * 60 * 1000;
  const pollIntervalMs = options?.pollIntervalMs ?? 5_000;
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const { status, videoUrl, error } = await fetchHeyGenVideoStatus(heygenVideoId);

    if (status === "completed" && videoUrl) {
      return videoUrl;
    }
    if (status === "failed") {
      throw new Error(error ?? "HeyGen video generation failed");
    }

    await delay(pollIntervalMs);
  }

  throw new Error("HeyGen video generation timed out");
}

export async function generateHeyGenAvatarVideo(
  script: string,
  options?: {
    avatarId?: string;
    voiceId?: string;
    /** Server-side wait before returning "processing" (ms). Default ~4.5 min for API routes. */
    serverWaitMs?: number;
  }
): Promise<HeyGenResult> {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === "placeholder") {
    await delay(2000);
    return {
      videoId: "mock_heygen",
      avatarVideoUrl: MOCK_AVATAR_URL,
      status: "completed",
    };
  }

  if (
    options?.avatarId?.startsWith("preset_") ||
    options?.voiceId === "demo_voice"
  ) {
    await delay(2000);
    return {
      videoId: "mock_heygen",
      avatarVideoUrl: MOCK_AVATAR_URL,
      status: "completed",
    };
  }

  const heygenVideoId = await createHeyGenVideoJob(script, options);
  const serverWaitMs = options?.serverWaitMs ?? 4.5 * 60 * 1000;

  try {
    const avatarVideoUrl = await waitForHeyGenVideo(heygenVideoId, {
      maxWaitMs: serverWaitMs,
      pollIntervalMs: 5_000,
    });
    return { videoId: heygenVideoId, avatarVideoUrl, status: "completed" };
  } catch (pollError) {
    const reason = formatHeyGenError(
      pollError instanceof Error ? pollError.message : pollError
    );

    if (reason.includes("timed out")) {
      console.warn(
        `HeyGen still processing after ${serverWaitMs}ms, returning for client poll:`,
        heygenVideoId
      );
      return {
        videoId: heygenVideoId,
        status: "processing",
      };
    }

    if (allowMockOnFailure()) {
      console.warn("HeyGen failed, using demo avatar video:", reason);
      return {
        videoId: "mock_heygen_fallback",
        avatarVideoUrl: MOCK_AVATAR_URL,
        status: "completed",
        mockFallback: true,
        warning: `HeyGen could not finish this avatar (${reason}). Using a demo avatar video so you can still preview the ad.`,
      };
    }

    throw pollError instanceof Error ? pollError : new Error(reason);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
