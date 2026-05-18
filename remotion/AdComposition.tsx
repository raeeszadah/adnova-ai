import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** Resolve staged assets (public/) or remote https URLs for Remotion. */
function resolveMediaSrc(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  if (src.startsWith("remotion-render/")) {
    return staticFile(src);
  }
  return staticFile(src);
}

export type AdCompositionProps = {
  avatarVideoUrl: string;
  productImageUrl: string;
  scriptText: string;
};

function splitScriptLines(script: string): string[] {
  return script
    .split(/\n+/)
    .map((line) => line.replace(/^(Hook|Benefits|CTA|Call to Action):\s*/i, "").trim())
    .filter(Boolean);
}

const SubtitleLine: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({ frame, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 40,
        right: 40,
        textAlign: "center",
        opacity,
        transform: `translateY(${interpolate(opacity, [0, 1], [20, 0])}px)`,
      }}
    >
      <span
        style={{
          backgroundColor: "rgba(0,0,0,0.75)",
          color: "#D1FF00",
          padding: "12px 24px",
          borderRadius: 12,
          fontSize: 36,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.3,
          display: "inline-block",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const AdComposition: React.FC<AdCompositionProps> = ({
  avatarVideoUrl,
  productImageUrl,
  scriptText,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const lines = splitScriptLines(scriptText);
  const framesPerLine = Math.max(
    Math.floor(durationInFrames / Math.max(lines.length, 1)),
    fps * 2
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(209,255,0,0.15), transparent 60%)",
        }}
      />

      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center" }}>
        <div
          style={{
            marginTop: 40,
            width: "88%",
            height: "52%",
            borderRadius: 24,
            overflow: "hidden",
            border: "3px solid rgba(209,255,0,0.4)",
            boxShadow: "0 0 40px rgba(209,255,0,0.2)",
          }}
        >
          <OffthreadVideo
            src={resolveMediaSrc(avatarVideoUrl)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            acceptableTimeShiftInSeconds={1}
            pauseWhenBuffering={false}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 280,
        }}
      >
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: 24,
            overflow: "hidden",
            border: "4px solid #D1FF00",
            boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
            backgroundColor: "#111",
          }}
        >
          <Img
            src={resolveMediaSrc(productImageUrl)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </AbsoluteFill>

      {lines.map((line, index) => (
        <Sequence
          key={`${index}-${line.slice(0, 20)}`}
          from={index * framesPerLine}
          durationInFrames={framesPerLine}
        >
          <SubtitleLine text={line} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
