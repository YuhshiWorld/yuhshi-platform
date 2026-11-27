/**
 * Gradient tokens (§16.4). Reserved for meaningful moments: onboarding, matching,
 * passport milestones, the Fusion Moment (E3), the wordmark i-dot. Never on every button.
 */
import { brand, fusion } from './color';

export interface GradientToken {
  name: string;
  stops: readonly string[];
  /** Default angle in degrees (CSS convention). */
  angle: number;
}

export const gradients = {
  /** Signature: Spirit → Fusion Violet → Human. */
  signature: { name: 'Signature Fusion', stops: [fusion.indigo, fusion.violet, fusion.teal], angle: 135 },
  globalHorizon: { name: 'Global Horizon', stops: [brand.spirit, brand.orbit], angle: 135 },
  worldFlow: { name: 'World Flow', stops: [brand.human, brand.orbit], angle: 135 },
  discoverySpark: { name: 'Discovery Spark', stops: [brand.horizon, brand.pulse], angle: 135 },
  humanFusion: { name: 'Human Fusion', stops: [brand.spirit, brand.human], angle: 135 },
} as const satisfies Record<string, GradientToken>;

export function toCssGradient(g: GradientToken): string {
  return `linear-gradient(${g.angle}deg, ${g.stops.join(', ')})`;
}
