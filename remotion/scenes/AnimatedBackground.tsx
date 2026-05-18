import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { floatingOffset } from "../lib/motion";

export const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const drift = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const pulse = 0.85 + Math.sin(frame * 0.06) * 0.15;
  const orbY = floatingOffset(frame, 28, 0.05);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070a", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 120% 80% at ${50 + drift * 8}% ${-10 + orbY * 0.2}%, rgba(209,255,0,${0.18 * pulse}) 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at ${85 - drift * 12}% ${75 + orbY * 0.15}%, rgba(0,240,255,${0.12 * pulse}) 0%, transparent 50%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 100%, rgba(209,255,0,0.08) 0%, transparent 45%)`,
        }}
      />
      {/* Subtle cinematic streaks */}
      <AbsoluteFill
        style={{
          opacity: 0.35,
          background: `linear-gradient(${115 + drift * 20}deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)`,
          transform: `translateX(${interpolate(frame, [0, durationInFrames], [-80, 80])}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.06,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: `perspective(800px) rotateX(58deg) translateY(${120 + drift * 40}px) scale(1.4)`,
        }}
      />
    </AbsoluteFill>
  );
};
