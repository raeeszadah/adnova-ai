import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { resolveMediaSrc } from "../lib/media";
import { floatingOffset, kenBurnsScale, springIn, SPRING_BOUNCY } from "../lib/motion";

type ProductRevealSceneProps = {
  productImageUrl: string;
};

export const ProductRevealScene: React.FC<ProductRevealSceneProps> = ({
  productImageUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = springIn(frame, fps, 0, SPRING_BOUNCY);
  const scale = interpolate(enter, [0, 1], [0.72, 1]) * kenBurnsScale(frame, 0, durationInFrames, 1, 1.1);
  const rotate = interpolate(enter, [0, 1], [-4, 0]);
  const glow = 0.35 + Math.sin(frame * 0.08) * 0.15;
  const floatY = floatingOffset(frame, 14, 0.07);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: "78%",
          height: "58%",
          borderRadius: 32,
          overflow: "hidden",
          border: "4px solid rgba(209,255,0,0.65)",
          boxShadow: `0 0 ${60 + glow * 40}px rgba(209,255,0,${0.25 + glow * 0.2}), 0 24px 80px rgba(0,0,0,0.65)`,
          transform: `scale(${scale}) rotate(${rotate}deg) translateY(${floatY}px)`,
          backgroundColor: "#0d1117",
        }}
      >
        <Img
          src={resolveMediaSrc(productImageUrl)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 200,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(209,255,0,0.7)",
          opacity: interpolate(enter, [0, 1], [0, 1]),
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Introducing
      </div>
    </AbsoluteFill>
  );
};

// Fix: I used motion.div but didn't import from remotion - should use regular div