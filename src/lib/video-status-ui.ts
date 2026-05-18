import type { GenerationPhase } from "@/components/loading/VideoGenerationProgress";

export function mapVideoJobToPhase(video: {
  status: string;
  pipelinePhase?: string | null;
  heygenVideoId?: string | null;
}): GenerationPhase {
  const phase = video.pipelinePhase;
  if (phase === "script") return "script";
  if (phase === "avatar") return "avatar";
  if (phase === "heygen") return "heygen";
  if (phase === "compose") return "compose";
  if (phase === "finalize") return "finalize";

  switch (video.status) {
    case "GENERATING_SCRIPT":
      return "script";
    case "PROCESSING_AVATAR":
      return video.heygenVideoId ? "heygen" : "avatar";
    case "AVATAR_GENERATED":
      return "heygen";
    case "COMPOSING":
      return "compose";
    case "COMPLETED":
      return "finalize";
    default:
      return "avatar";
  }
}

export function mapVideoJobToProgress(video: {
  status: string;
  pipelineProgress?: number | null;
}): number {
  if (typeof video.pipelineProgress === "number") {
    return Math.min(100, Math.max(0, video.pipelineProgress));
  }
  switch (video.status) {
    case "GENERATING_SCRIPT":
      return 15;
    case "SCRIPT_GENERATED":
      return 20;
    case "PROCESSING_AVATAR":
      return 40;
    case "AVATAR_GENERATED":
      return 65;
    case "COMPOSING":
      return 85;
    case "COMPLETED":
      return 100;
    default:
      return 10;
  }
}
