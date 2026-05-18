"use client";

import { useCallback, useEffect, useState } from "react";
import { AppIcon } from "@/components/icons";
import { VideoThumbnailSkeleton } from "@/components/loading/VideoThumbnailSkeleton";

type VideoPlayerProps = {
  videoId: string;
  title?: string;
  className?: string;
  /** Thumbnail-style preview in grid (muted, loop, no controls) */
  preview?: boolean;
  autoPlay?: boolean;
};

export function VideoPlayer({
  videoId,
  title,
  className = "w-full h-full",
  preview = false,
  autoPlay = false,
}: VideoPlayerProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setSrc(null);

      try {
        const res = await fetch(`/api/videos/${videoId}/playback`, {
          credentials: "include",
        });
        const data = (await res.json()) as { url?: string; error?: string };

        if (cancelled) return;

        if (!res.ok || !data.url) {
          throw new Error(data.error ?? "Video is not available");
        }

        setSrc(data.url);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Could not load video"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  const onVideoError = useCallback(() => {
    setError(
      "Playback failed. The file may have expired — create a new video or use Download."
    );
    setSrc(null);
  }, []);

  if (loading) {
    return <VideoThumbnailSkeleton className={className} />;
  }

  if (error || !src) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center bg-black/40 text-muted-foreground p-4 text-center text-xs gap-2`}
      >
        <AppIcon name="videocam_off" size="xl" />
        <span>{error ?? "Video unavailable"}</span>
      </div>
    );
  }

  return (
    <video
      key={src}
      src={src}
      title={title}
      className={className}
      controls={!preview}
      playsInline
      preload="metadata"
      muted={preview}
      loop={preview}
      autoPlay={autoPlay || preview}
      onError={onVideoError}
    />
  );
}
