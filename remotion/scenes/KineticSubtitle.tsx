import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../lib/motion";

type KineticSubtitleProps = {
  text: string;
};

export const KineticSubtitle: React.FC<KineticSubtitleProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: SPRING_SNAPPY });
  const y = interpolate(enter, [0, 1], [32, 0]);
  const scale = interpolate(enter, [0, 1], [0.92, 1]);
  const blurOpacity = interpolate(enter, [0, 1], [0.4, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 118,
        left: 32,
        right: 32,
        textAlign: "center",
        opacity: blurOpacity,
        transform: `translateY(${y}px) scale(${scale})`,
      }}
    >
      <span
        style={{
          backgroundColor: "rgba(0,0,0,0.78)",
          color: "#D1FF00",
          padding: "14px 28px",
          borderRadius: 14,
          fontSize: 34,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.25,
          display: "inline-block",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
          border: "1px solid rgba(209,255,0,0.25)",
        }}
      >
        {text}
      </span>
    </div>
  );
};
