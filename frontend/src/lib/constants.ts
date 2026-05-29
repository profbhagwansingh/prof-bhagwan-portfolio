// ─── API ─────────────────────────────────────────────────────────
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── Site Identity ───────────────────────────────────────────────
export const SITE_NAME = "Prof. (Dr.) Bhagwan Singh";
export const SITE_TAGLINE = "Care for People, Planet & Peace";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bhagwansingh.com";
export const SITE_DESCRIPTION =
  "Official portfolio of Prof. (Dr.) Bhagwan Singh — Management faculty, researcher, author, and mentor at DSMM College.";

// ─── Brand Colors ────────────────────────────────────────────────
export const COLORS = {
  primary: "#5061C4",
  primaryLight: "#eef0fb",
  ink: "#1a1a2e",
  inkSoft: "#3d3d5c",
  inkMuted: "#6b6b8a",
  parchment: "#faf9f7",
  parchmentWarm: "#f5f3ef",
  border: "#e8e5df",
} as const;

// ─── Breakpoints (match Tailwind) ────────────────────────────────
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ─── Rate Limits (for reference in frontend UX) ──────────────────
export const RATE_LIMITS = {
  contactForm: { maxAttempts: 3, windowMs: 60_000 },
  alumniForm: { maxAttempts: 3, windowMs: 60_000 },
  login: { maxAttempts: 5, windowMs: 60_000 },
} as const;

// ─── Social Platforms (default icons) ────────────────────────────
export const SOCIAL_PLATFORMS = [
  "LinkedIn",
  "Google Scholar",
  "ResearchGate",
  "ORCID",
  "Twitter/X",
  "YouTube",
  "Academia.edu",
] as const;
