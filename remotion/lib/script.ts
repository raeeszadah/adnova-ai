export function splitScriptLines(script: string): string[] {
  return script
    .split(/\n+/)
    .map((line) =>
      line.replace(/^(Hook|Benefits|CTA|Call to Action):\s*/i, "").trim()
    )
    .filter(Boolean);
}

export function pickCtaLine(lines: string[]): string {
  if (lines.length === 0) return "Shop Now";
  const tagged = lines.find((l) => /^cta:/i.test(l));
  if (tagged) return tagged.replace(/^cta:\s*/i, "");
  const action = lines.find((l) =>
    /\b(buy|shop|order|get yours|try now|click|grab|claim|start)\b/i.test(l)
  );
  return action ?? lines[lines.length - 1];
}

/** Subtitle lines during the main story beat (excludes dedicated CTA line when possible). */
export function pickStoryLines(lines: string[]): string[] {
  if (lines.length <= 1) return lines;
  const cta = pickCtaLine(lines);
  const withoutCta = lines.filter((l) => l !== cta);
  return withoutCta.length > 0 ? withoutCta : lines.slice(0, -1);
}

export type SceneTiming = {
  revealEnd: number;
  ctaStart: number;
  crossfade: number;
};

export function getSceneTiming(durationInFrames: number): SceneTiming {
  const crossfade = Math.min(18, Math.floor(durationInFrames * 0.04));
  const revealEnd = Math.max(
    Math.floor(durationInFrames * 0.22),
    Math.min(90, Math.floor(durationInFrames * 0.35))
  );
  const ctaStart = Math.min(
    durationInFrames - Math.max(60, Math.floor(durationInFrames * 0.18)),
    Math.floor(durationInFrames * 0.74)
  );
  return {
    revealEnd: Math.max(revealEnd, crossfade + 30),
    ctaStart: Math.max(ctaStart, revealEnd + 45),
    crossfade,
  };
}
