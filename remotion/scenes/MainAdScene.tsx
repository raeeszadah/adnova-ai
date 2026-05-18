import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { resolveMediaSrc } from "../lib/media";
import {
  floatingOffset,
  kenBurnsScale,
  springIn,
  SPRING_CINEMATIC,
  SPRING_SNAPPY,
} from "../lib/motion";

type MainAdSceneProps = {
  avatarVideoUrl: string;
  productImageUrl: string;
  sceneStartFrame: number;
  sceneEndFrame: number;
};

type ProductLayout = {
  leftPct: number;
  topPct: number;
  width: number;
  height: number;
  rotate: number;
};

const PRODUCT_LAYOUTS: ProductLayout[] = [
  { leftPct: 50, topPct: 72, width: 340, height: 340, rotate: 0 },
  { leftPct: 78, topPct: 68, width: 280, height: 280, rotate: 3 },
  { leftPct: 22, topPct: 58, width: 300, height: 300, rotate: -4 },
];

export const MainAdScene: React.FC<MainAdSceneProps> = ({
  avatarVideoUrl,
  productImageUrl,
  sceneStartFrame,
  sceneEndFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - sceneStartFrame;
  const sceneLength = Math.max(sceneEndFrame - sceneStartFrame, 1);

  const avatarEnter = springIn(localFrame, fps, 4, SPRING_CINEMATIC);
  const avatarScale = interpolate(avatarEnter, [0, 1], [0.94, 1]) *
    kenBurnsScale(localFrame, 0, sceneLength, 1.02, 1);

  const segmentDuration = Math.max(Math.floor(sceneLength / 3), fps * 3);
  const segmentIndex = Math.min(
    2,
    Math.floor(localFrame / segmentDuration)
  );
  const segmentFrame = localFrame - segmentIndex * segmentDuration;
  const layout = PRODUCT_LAYOUTS[segmentIndex];
  const nextLayout =
    PRODUCT_LAYOUTS[Math.min(segmentIndex + 1, PRODUCT_LAYOUTS.length - 1)];

  const segmentProgress = springIn(
    segmentFrame,
    fps,
    0,
    SPRING_SNAPPY
  );

  const productWidth = interpolate(segmentProgress, [0, 1], [layout.width, nextLayout.width]);
  const productHeight = interpolate(segmentProgress, [0, 1], [layout.height, nextLayout.height]);
  const productRotate = interpolate(segmentProgress, [0, 1], [layout.rotate, nextLayout.rotate]);
  const productLeft = interpolate(segmentProgress, [0, 1], [layout.leftPct, nextLayout.leftPct]);
  const productTop = interpolate(segmentProgress, [0, 1], [layout.topPct, nextLayout.topPct]);

  const floatY = floatingOffset(localFrame, 12, 0.08);
  const floatX = floatingOffset(localFrame + 40, 6, 0.06);
  const productScale =
    kenBurnsScale(localFrame, 0, sceneLength, 1, 1.08) *
    (0.96 + segmentProgress * 0.04);

  const glowPulse = 0.5 + Math.sin(localFrame * 0.1) * 0.25;

  return (
    <AbsoluteFill>
      {/* Avatar — top hero */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginTop: 36,
            width: "90%",
            height: "50%",
            borderRadius: 28,
            overflow: "hidden",
            border: "3px solid rgba(209,255,0,0.45)",
            boxShadow: `0 0 ${40 + glowPulse * 30}px rgba(209,255,0,${0.15 + glowPulse * 0.15}), 0 16px 48px rgba(0,0,0,0.5)`,
            transform: `scale(${avatarScale}) translateY(${interpolate(avatarEnter, [0, 1], [-24, 0])}px)`,
            opacity: avatarEnter,
          }}
        >
          <OffthreadVideo
            src={resolveMediaSrc(avatarVideoUrl)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            acceptableTimeShiftInSeconds={1}
            pauseWhenBuffering={false}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, transparent 70%, rgba(5,7,10,0.85) 100%)",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Dynamic floating product */}
      <div
        style={{
          position: "absolute",
          left: `${productLeft}%`,
          top: `${productTop}%`,
          width: productWidth,
          height: productHeight,
          transform: `translate(-50%, -50%) translate(${floatX}px, ${floatY}px) scale(${productScale}) rotate(${productRotate}deg)`,
          borderRadius: 24,
          overflow: "hidden",
          border: "4px solid #D1FF00",
          boxShadow: `0 12px 48px rgba(0,0,0,0.55), 0 0 ${24 + glowPulse * 20}px rgba(209,255,0,0.35)`,
          backgroundColor: "#111",
        }}
      >
        <Img
          src={resolveMediaSrc(productImageUrl)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
