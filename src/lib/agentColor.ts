/**
 * Agent avatar coloring.
 *
 * Light mode keeps the original look (soft color tint + same-color letter).
 * In dark mode, dark agent colors (the default is #1e293b, a near-black
 * slate) would render an invisible letter on the dark surface, so we lift the
 * letter to a bright version of the same hue. The agent keeps its color
 * identity and the initial is always readable.
 */

type AvatarStyle = { backgroundColor: string; color: string };

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-fA-F]{6})$/.exec((hex || "").trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return [Math.round(h), s, l];
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function agentAvatarStyle(hex: string, dark: boolean): AvatarStyle {
  // Light mode: preserve the existing tint + same-color letter exactly.
  if (!dark) {
    const base = hex || "#1e293b";
    return { backgroundColor: base + "20", color: base };
  }

  const rgb = parseHex(hex);
  if (!rgb) {
    // Unknown color: fall back to the brand tint, always readable on dark.
    return { backgroundColor: "rgba(232,97,60,0.18)", color: "#f0936f" };
  }

  const [h, s, l] = rgbToHsl(...rgb);
  const sat = Math.round(clamp(s, 0.45, 0.9) * 100);
  const light = Math.round(clamp(l, 0.62, 0.8) * 100);
  return {
    color: `hsl(${h}, ${sat}%, ${light}%)`,
    backgroundColor: `hsla(${h}, ${sat}%, ${light}%, 0.18)`,
  };
}
