import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { sceneCrossfade } from "./lib/motion";
import {
  getSceneTiming,
  pickCtaLine,
  pickStoryLines,
  splitScriptLines,
} from "./lib/script";
import { AnimatedBackground } from "./scenes/AnimatedBackground";
import { CtaScene } from "./scenes/CtaScene";
import { KineticSubtitle } from "./scenes/KineticSubtitle";
import { MainAdScene } from "./scenes/MainAdScene";
import { ProductRevealScene } from "./scenes/ProductRevealScene";

export type AdCompositionProps = {
  avatarVideoUrl: string;
  productImageUrl: string;
  scriptText: string;
};

/** Layer opacities for crossfading story beats. */
const SceneLayer: React.FC<{
  fadeInStart: number;
  fadeInEnd: number;
  fadeOutStart: number;
  fadeOutEnd: number;
  children: React.ReactNode;
}> = ({ fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd, children }) => {
  const frame = useCurrentFrame();

  const fadeIn = sceneCrossfade(frame, fadeInStart, fadeInEnd).to;
  const fadeOut =
    fadeOutEnd > fadeOutStart
      ? 1 - sceneCrossfade(frame, fadeOutStart, fadeOutEnd).to
      : 1;

  const opacity = Math.min(fadeIn, fadeOut);

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const AdComposition: React.FC<AdCompositionProps> = ({
  avatarVideoUrl,
  productImageUrl,
  scriptText,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const lines = splitScriptLines(scriptText);
  const storyLines = pickStoryLines(lines);
  const ctaLine = pickCtaLine(lines);
  const { revealEnd, ctaStart, crossfade } = getSceneTiming(durationInFrames);

  const mainStart = revealEnd - crossfade;
  const ctaFadeStart = ctaStart - crossfade;

  const subtitleWindow = Math.max(ctaStart - mainStart, fps * 2);
  const framesPerLine = Math.max(
    Math.floor(subtitleWindow / Math.max(storyLines.length, 1)),
    Math.floor(fps * 2)
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070a" }}>
      <AnimatedBackground />

      {/* Act 1 — cinematic product reveal */}
      <SceneLayer
        fadeInStart={0}
        fadeInEnd={8}
        fadeOutStart={revealEnd - crossfade}
        fadeOutEnd={revealEnd}
      >
        <ProductRevealScene productImageUrl={productImageUrl} />
      </SceneLayer>

      {/* Act 2 — avatar + dynamic floating product showcase */}
      <SceneLayer
        fadeInStart={mainStart}
        fadeInEnd={revealEnd}
        fadeOutStart={ctaFadeStart}
        fadeOutEnd={ctaStart}
      >
        <MainAdScene
          avatarVideoUrl={avatarVideoUrl}
          productImageUrl={productImageUrl}
          sceneStartFrame={mainStart}
          sceneEndFrame={ctaStart}
        />
      </SceneLayer>

      {/* Act 3 — motion CTA finale */}
      <SceneLayer
        fadeInStart={ctaFadeStart}
        fadeInEnd={ctaStart}
        fadeOutStart={durationInFrames}
        fadeOutEnd={durationInFrames}
      >
        <CtaScene
          productImageUrl={productImageUrl}
          ctaText={ctaLine}
          sceneStartFrame={ctaStart}
        />
      </SceneLayer>

      {/* Kinetic subtitles during main story (hidden during reveal + CTA) */}
      {storyLines.map((line, index) => {
        const from = mainStart + index * framesPerLine;
        if (from >= ctaStart - fps) return null;

        return (
          <Sequence
            key={`${index}-${line.slice(0, 24)}`}
            from={from}
            durationInFrames={Math.min(framesPerLine, ctaStart - from)}
          >
            <KineticSubtitle text={line} />
          </Sequence>
        );
      })}

      {/* Brand vignette */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.55)",
        }}
      />
    </AbsoluteFill>
  );
};

// Re-export helpers used by the render pipeline
export { splitScriptLines } from "./lib/script";
export { resolveMediaSrc } from "./lib/media";
