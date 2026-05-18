import path from "path";
import fs from "fs/promises";
import os from "os";
import { bundle } from "@remotion/bundler";
import {
  getVideoMetadata,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";
import type { AdCompositionProps } from "../../remotion/AdComposition";
import {
  cleanupMediaFiles,
  downloadMediaToRemotionPublic,
} from "@/lib/download-media";

const COMPOSITION_ID = "AdNovaAd";
const FPS = 30;
const MIN_DURATION_FRAMES = 90;
const MAX_DURATION_FRAMES = FPS * 120; // cap at 2 minutes

let bundleLocation: string | null = null;

async function getBundleLocation(): Promise<string> {
  if (bundleLocation) {
    return bundleLocation;
  }

  const entryPoint = path.join(process.cwd(), "remotion", "index.ts");
  bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  return bundleLocation;
}

function getRenderConcurrency(): number | null {
  const raw = process.env.REMOTION_RENDER_CONCURRENCY;
  if (!raw) return 2;
  if (raw === "auto" || raw === "null") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

function getRenderScale(): number {
  const n = Number(process.env.REMOTION_RENDER_SCALE ?? "1");
  return Number.isFinite(n) && n > 0 && n <= 1 ? n : 1;
}

export async function renderAdVideo(
  inputProps: AdCompositionProps
): Promise<string> {
  const tempFiles: string[] = [];
  const prefetchStart = Date.now();

  try {
    console.log("[Remotion] Prefetching avatar video and product image…");
    const [avatarAsset, productAsset] = await Promise.all([
      downloadMediaToRemotionPublic(inputProps.avatarVideoUrl, ".mp4"),
      downloadMediaToRemotionPublic(inputProps.productImageUrl, ".jpg"),
    ]);

    tempFiles.push(avatarAsset.absolutePath, productAsset.absolutePath);

    console.log(
      `[Remotion] Prefetch done in ${((Date.now() - prefetchStart) / 1000).toFixed(1)}s`
    );

    const localProps: AdCompositionProps = {
      ...inputProps,
      avatarVideoUrl: avatarAsset.publicRelativePath,
      productImageUrl: productAsset.publicRelativePath,
    };

    let durationInFrames = MIN_DURATION_FRAMES;
    try {
      const meta = await getVideoMetadata(avatarAsset.absolutePath);
      const seconds = meta.durationInSeconds ?? 15;
      durationInFrames = Math.min(
        Math.max(Math.ceil(seconds * FPS) + FPS, MIN_DURATION_FRAMES),
        MAX_DURATION_FRAMES
      );
      console.log(
        `[Remotion] Avatar duration ${seconds.toFixed(1)}s → ${durationInFrames} frames`
      );
    } catch (metaErr) {
      console.warn("[Remotion] Could not read video metadata, using default duration:", metaErr);
      durationInFrames = 450;
    }

    const serveUrl = await getBundleLocation();

    const composition = await selectComposition({
      serveUrl,
      id: COMPOSITION_ID,
      inputProps: localProps,
    });

    const outputPath = path.join(
      os.tmpdir(),
      `adnova-${crypto.randomUUID()}.mp4`
    );

    const renderStart = Date.now();
    console.log("[Remotion] Starting render…");

    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
      },
      serveUrl,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: localProps,
      concurrency: getRenderConcurrency(),
      offthreadVideoCacheSizeInBytes: 1024 * 1024 * 1024,
      scale: getRenderScale(),
      jpegQuality: 82,
      chromiumOptions: {
        disableWebSecurity: true,
      },
      timeoutInMilliseconds: 15 * 60 * 1000,
      onProgress: ({ progress }) => {
        if (progress % 0.1 < 0.02 || progress > 0.99) {
          console.log(`[Remotion] Progress ${(progress * 100).toFixed(0)}%`);
        }
      },
    });

    console.log(
      `[Remotion] Render finished in ${((Date.now() - renderStart) / 1000).toFixed(1)}s`
    );

    return outputPath;
  } finally {
    await cleanupMediaFiles(tempFiles);
  }
}

export async function cleanupRenderFile(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore cleanup errors
  }
}
