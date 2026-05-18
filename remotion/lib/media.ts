import { staticFile } from "remotion";

/** Resolve staged assets (public/) or remote https URLs for Remotion. */
export function resolveMediaSrc(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  if (src.startsWith("remotion-render/")) {
    return staticFile(src);
  }
  return staticFile(src);
}
