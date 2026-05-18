import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { resolveMediaSrc } from "../lib/media";
import {
  floatingOffset,
  springIn,
  SPRING_BOUNCY,
  SPRING_SNAPPY,
} from "../lib/motion";

type CtaSceneProps = {
  productImageUrl: string;
  ctaText: string;
  sceneStartFrame: number;
};

export const CtaScene: React.FC<CtaSceneProps> = ({
  productImageUrl,
  ctaText,
  sceneStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - sceneStartFrame;

  const enter = springIn(localFrame, fps, 0, SPRING_BOUNCY);
  const buttonPop = springIn(localFrame, fps, 10, SPRING_SNAPPY);
  const floatY = floatingOffset(localFrame, 10, 0.09);
  const shimmer = (localFrame % 45) / 45;

  const productScale = interpolate(enter, [0, 1], [0.85, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: "72%",
          height: "42%",
          borderRadius: 28,
          overflow: "hidden",
          border: "4px solid rgba(209,255,0,0.8)",
          boxShadow: "0 0 60px rgba(209,255,0,0.35), 0 20px 60px rgba(0,0,0,0.6)",
          transform: `scale(${productScale}) translateY(${floatY - 40}px)`,
          opacity: enter,
          backgroundColor: "#0d1117",
        }}
      >
        <Img
          src={resolveMediaSrc(productImageUrl)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 48,
          right: 48,
          textAlign: "center",
          transform: `translateY(${interpolate(buttonPop, [0, 1], [40, 0])}px) scale(${interpolate(buttonPop, [0, 1], [0.9, 1])})`,
          opacity: buttonPop,
        }}
      >
        <div
          style={{
            display: "inline-block",
            position: "relative",
            overflow: "hidden",
            borderRadius: 999,
            isolation: "isolate",
            background: "linear-gradient(135deg, #d1ff00 0%, #a8e600 100%)",
            padding: "22px 48px",
            boxShadow: `0 0 ${30 + shimmer * 20}px rgba(209,255,0,0.5)`,
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: "#0a0a0a",
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            {ctaText}
          </span>
          <AbsoluteFill
            style={{
              background: `linear-gradient(105deg, transparent ${shimmer * 100 - 20}%, rgba(255,255,255,0.45) ${shimmer * 100}%, transparent ${shimmer * 100 + 20}%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 200,
          fontSize: 18,
          fontWeight: 700,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: interpolate(localFrame, [15, 35], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Limited time offer
      </div>
    </AbsoluteFill>
  );
};
