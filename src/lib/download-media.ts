import { createWriteStream } from "fs";
import fs from "fs/promises";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

const DOWNLOAD_TIMEOUT_MS = 10 * 60 * 1000;

function isLocalPath(src: string): boolean {
  if (src.startsWith("file://")) return true;
  if (src.startsWith("/")) return true;
  return /^[A-Za-z]:[\\/]/.test(src);
}

function extensionFromUrl(url: string, fallback: string): string {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const match = pathname.match(/\.(mp4|webm|mov|png|jpe?g|webp|gif)$/);
    if (match) return match[0];
  } catch {
    // not a URL
  }
  return fallback;
}

const REMOTION_PUBLIC_SUBDIR = "remotion-render";

/** Path relative to `public/` for Remotion `staticFile()`. */
export type RemotionPublicAsset = {
  /** e.g. `remotion-render/asset-uuid.jpg` */
  publicRelativePath: string;
  /** Absolute filesystem path for ffprobe / cleanup */
  absolutePath: string;
};

export function getRemotionPublicAssetsDir(): string {
  return path.join(process.cwd(), "public", REMOTION_PUBLIC_SUBDIR);
}

/**
 * Download or copy media into `public/remotion-render/` so Remotion can load it
 * via HTTP (`staticFile()`). Avoids broken `file://` URLs in Chromium.
 */
export async function downloadMediaToRemotionPublic(
  src: string,
  fallbackExt: string
): Promise<RemotionPublicAsset> {
  const publicDir = getRemotionPublicAssetsDir();
  await fs.mkdir(publicDir, { recursive: true });

  const ext = extensionFromUrl(src, fallbackExt);
  const filename = `asset-${crypto.randomUUID()}${ext}`;
  const absolutePath = path.join(publicDir, filename);
  const publicRelativePath = `${REMOTION_PUBLIC_SUBDIR}/${filename}`;

  if (isLocalPath(src)) {
    const local = src.startsWith("file://")
      ? decodeURIComponent(new URL(src).pathname.replace(/^\/([A-Za-z]:)/, "$1"))
      : src;
    await fs.copyFile(path.resolve(local), absolutePath);
    return { publicRelativePath, absolutePath };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(src, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "AdNovaAI/1.0 (Remotion prefetch)",
        Accept: "*/*",
      },
    });

    if (!response.ok || !response.body) {
      throw new Error(
        `Failed to download media (${response.status}): ${src.slice(0, 120)}`
      );
    }

    const nodeStream = Readable.fromWeb(
      response.body as Parameters<typeof Readable.fromWeb>[0]
    );
    await pipeline(nodeStream, createWriteStream(absolutePath));
    return { publicRelativePath, absolutePath };
  } finally {
    clearTimeout(timeout);
  }
}

export async function cleanupMediaFiles(absolutePaths: string[]) {
  await Promise.all(
    absolutePaths.map(async (filePath) => {
      if (!filePath) return;
      try {
        await fs.unlink(filePath);
      } catch {
        // ignore
      }
    })
  );
}
