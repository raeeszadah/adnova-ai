import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchAction, fetchQuery } from "@/lib/convex-server";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";
export const maxDuration = 120;

function safeFilename(title?: string) {
  const base = (title ?? "adnova-video")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base || "adnova-video"}.mp4`;
}

function isConvexStorageUrl(url: string) {
  return (
    url.includes("convex.cloud") ||
    url.includes("convex.site") ||
    url.includes("/api/storage/")
  );
}

async function resolvePlaybackUrl(video: {
  finalStorageId?: Id<"_storage">;
  finalVideoUrl?: string;
  avatarVideoUrl?: string;
}): Promise<string | null> {
  if (video.finalStorageId) {
    const fresh = await fetchQuery(api.files.getStorageUrl, {
      storageId: video.finalStorageId,
    });
    if (fresh) return fresh;
  }

  if (video.finalVideoUrl) return video.finalVideoUrl;
  if (video.avatarVideoUrl) return video.avatarVideoUrl;

  return null;
}

async function fetchVideoBytes(url: string): Promise<{
  buffer: ArrayBuffer;
  contentType: string;
}> {
  const upstream = await fetch(url, {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
    headers: { Accept: "video/mp4,video/*,*/*" },
  });

  if (!upstream.ok) {
    throw new Error(`Upstream returned ${upstream.status}`);
  }

  const buffer = await upstream.arrayBuffer();
  if (buffer.byteLength === 0) {
    throw new Error("Video file is empty");
  }

  return {
    buffer,
    contentType: upstream.headers.get("content-type") ?? "video/mp4",
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId: rawId } = await params;
  const video = await fetchQuery(api.videos.getStatusForUser, {
    videoId: rawId as Id<"videos">,
    clerkId: userId,
  });

  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const playbackUrl = await resolvePlaybackUrl({
    finalStorageId: video.finalStorageId,
    finalVideoUrl: video.finalVideoUrl,
    avatarVideoUrl: video.avatarVideoUrl,
  });

  if (!playbackUrl) {
    return NextResponse.json(
      {
        error:
          video.status === "COMPLETED"
            ? "Video file is missing. Try creating a new ad."
            : `Video is still ${video.status.replace(/_/g, " ").toLowerCase()}.`,
        status: video.status,
      },
      { status: 404 }
    );
  }

  const download = req.nextUrl.searchParams.get("download") === "1";

  if (download) {
    const filename = safeFilename(video.title);

    if (video.finalStorageId) {
      try {
        const stored = await fetchAction(api.files.readStorageBytes, {
          storageId: video.finalStorageId,
        });
        if (stored?.base64) {
          const buffer = Buffer.from(stored.base64, "base64");
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": stored.contentType ?? "video/mp4",
              "Content-Length": String(stored.byteLength ?? buffer.byteLength),
              "Content-Disposition": `attachment; filename="${filename}"`,
              "Cache-Control": "private, no-cache",
            },
          });
        }
      } catch (e) {
        console.error("Convex storage read failed, trying URL fetch:", e);
      }
    }

    if (isConvexStorageUrl(playbackUrl)) {
      try {
        const { buffer, contentType } = await fetchVideoBytes(playbackUrl);
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Length": String(buffer.byteLength),
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "private, no-cache",
          },
        });
      } catch (e) {
        console.error("Convex URL fetch failed:", e);
        return NextResponse.json(
          {
            error:
              "Could not download video from storage. Try creating a new ad.",
          },
          { status: 502 }
        );
      }
    }

    try {
      const { buffer, contentType } = await fetchVideoBytes(playbackUrl);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(buffer.byteLength),
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "private, no-cache",
        },
      });
    } catch (e) {
      console.error("External video download failed, redirecting:", e);
      return NextResponse.redirect(playbackUrl, 307);
    }
  }

  return NextResponse.json({
    url: playbackUrl,
    status: video.status,
    title: video.title,
  });
}
