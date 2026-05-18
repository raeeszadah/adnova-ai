import { interpolate, spring } from "remotion";

type SpringPreset = {
  damping: number;
  stiffness?: number;
  mass?: number;
};

export const SPRING_SMOOTH: SpringPreset = { damping: 200 };
export const SPRING_CINEMATIC: SpringPreset = { damping: 28, stiffness: 120 };
export const SPRING_SNAPPY: SpringPreset = { damping: 18, stiffness: 200 };
export const SPRING_BOUNCY: SpringPreset = { damping: 14, stiffness: 160 };

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Smooth crossfade between two layers. */
export function sceneCrossfade(
  frame: number,
  fadeStart: number,
  fadeEnd: number
): { from: number; to: number } {
  const t = interpolate(frame, [fadeStart, fadeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { from: 1 - t, to: t };
}

export function springIn(
  frame: number,
  fps: number,
  delay = 0,
  config: SpringPreset = SPRING_CINEMATIC
): number {
  return spring({ frame: frame - delay, fps, config });
}

export function floatingOffset(frame: number, amplitude = 10, speed = 0.09): number {
  return Math.sin(frame * speed) * amplitude;
}

export function kenBurnsScale(
  frame: number,
  startFrame: number,
  endFrame: number,
  from = 1,
  to = 1.12
): number {
  return interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
