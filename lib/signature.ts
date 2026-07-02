export const signatureThemeKeys = [
  "auto",
  "romantic-photobook",
  "memory-album",
  "celebration-board",
  "quiet-keepsake",
  "blue-keepsake",
  "garden-note",
] as const;

export const signatureFontKeys = [
  "classic",
  "love-note",
  "storybook",
  "bright-hand",
  "clean",
  "movie-script",
  "casual-note",
  "elegant-serif",
] as const;
export const signatureMusicKeys = [
  "none",
  "birthday-pop",
  "romantic-groove",
  "celebration-pop",
  "friendship-bright",
  "cheeky-bounce",
  "gratitude-soul",
  "faith-ambient",
  "closure-calm",
  "apology-soft",
] as const;

export type SignatureTheme = (typeof signatureThemeKeys)[number];
export type SignatureFont = (typeof signatureFontKeys)[number];
export type SignatureMusic = (typeof signatureMusicKeys)[number];

export type SignaturePhoto = {
  id: string;
  src: string;
  caption?: string;
};

export const signatureThemes: Array<{ key: SignatureTheme; label: string; hint: string }> = [
  { key: "auto", label: "Auto", hint: "Match the occasion" },
  { key: "romantic-photobook", label: "Romantic photobook", hint: "Soft collage feel" },
  { key: "memory-album", label: "Memory album", hint: "Warm and personal" },
  { key: "celebration-board", label: "Celebration board", hint: "Bright milestone mood" },
  { key: "quiet-keepsake", label: "Quiet keepsake", hint: "Calm and intimate" },
  { key: "blue-keepsake", label: "Blue keepsake", hint: "Cool, polished, calm" },
  { key: "garden-note", label: "Garden note", hint: "Fresh and gentle" },
];

export const signatureFonts: Array<{ key: SignatureFont; label: string; hint: string }> = [
  { key: "love-note", label: "With love", hint: "Soft handwritten sign-off" },
  { key: "movie-script", label: "Movie script", hint: "Bold romantic title" },
  { key: "casual-note", label: "Casual note", hint: "Personal and playful" },
  { key: "bright-hand", label: "Birthday hand", hint: "Light celebration feel" },
  { key: "storybook", label: "Storybook", hint: "Soft cinematic serif" },
  { key: "elegant-serif", label: "Elegant serif", hint: "Graceful and premium" },
  { key: "classic", label: "Classic", hint: "Polished letter paper" },
  { key: "clean", label: "Modern clean", hint: "Simple and sharp" },
];

export const signatureMusic: Array<{ key: SignatureMusic; label: string }> = [
  { key: "none", label: "No soundtrack" },
  { key: "birthday-pop", label: "Birthday song" },
  { key: "romantic-groove", label: "Slow dance" },
  { key: "celebration-pop", label: "Celebration beat" },
  { key: "friendship-bright", label: "Friendship pop" },
  { key: "cheeky-bounce", label: "Playful bounce" },
  { key: "gratitude-soul", label: "Thank-you soul" },
  { key: "faith-ambient", label: "Faith instrumental" },
  { key: "closure-calm", label: "Peaceful instrumental" },
  { key: "apology-soft", label: "Soft apology" },
];

export function getDefaultSignatureTheme(occasion?: string | null): Exclude<SignatureTheme, "auto"> {
  if (occasion === "love") return "romantic-photobook";
  if (occasion === "birthday" || occasion === "congratulations") return "celebration-board";
  if (occasion === "faith" || occasion === "closure" || occasion === "ex") return "blue-keepsake";
  if (occasion === "friend" || occasion === "thank-you" || occasion === "appreciation") return "garden-note";
  return "memory-album";
}

export function normalizeSignatureTheme(
  value: unknown,
  occasion?: string | null
): Exclude<SignatureTheme, "auto"> {
  return signatureThemeKeys.includes(value as SignatureTheme) && value !== "auto"
    ? (value as Exclude<SignatureTheme, "auto">)
    : getDefaultSignatureTheme(occasion);
}

export function normalizeStoredSignatureTheme(value: unknown): SignatureTheme {
  return signatureThemeKeys.includes(value as SignatureTheme) ? (value as SignatureTheme) : "auto";
}

export function normalizeSignatureFont(value: unknown): SignatureFont {
  return signatureFontKeys.includes(value as SignatureFont) ? (value as SignatureFont) : "classic";
}

export function normalizeSignatureMusic(value: unknown): SignatureMusic {
  const legacyMap: Record<string, SignatureMusic> = {
    "soft-piano": "closure-calm",
    "slow-dance": "romantic-groove",
    "warm-rnb": "gratitude-soul",
  };
  const clean = String(value ?? "").trim();

  if (legacyMap[clean]) return legacyMap[clean];
  return signatureMusicKeys.includes(clean as SignatureMusic) ? (clean as SignatureMusic) : "none";
}

export function getDefaultSignatureMusic(occasion?: string | null): SignatureMusic {
  if (occasion === "birthday") return "birthday-pop";
  if (occasion === "love" || occasion === "confession") return "romantic-groove";
  if (occasion === "congratulations") return "celebration-pop";
  if (occasion === "friend") return "friendship-bright";
  if (occasion === "cheeky" || occasion === "situationship") return "cheeky-bounce";
  if (occasion === "faith") return "faith-ambient";
  if (occasion === "closure" || occasion === "ex") return "closure-calm";
  if (occasion === "apology") return "apology-soft";
  if (occasion === "thank-you" || occasion === "appreciation") return "gratitude-soul";
  return "romantic-groove";
}

export function getSignatureMusicLabel(music: SignatureMusic) {
  return signatureMusic.find((item) => item.key === music)?.label ?? "Soundtrack";
}

export function getSignatureMusicSrc(music: SignatureMusic) {
  return `/api/signature-music/${music}`;
}

export function getSignatureAccentFontFamily(font: SignatureFont) {
  if (font === "love-note") return 'var(--font-dancing-script), "Segoe Script", "Brush Script MT", cursive';
  if (font === "movie-script") return 'var(--font-pacifico), "Segoe Script", cursive';
  if (font === "casual-note") return 'var(--font-caveat), "Segoe Print", "Comic Sans MS", cursive';
  if (font === "bright-hand") return 'var(--font-caveat), "Segoe Print", cursive';
  if (font === "storybook") return 'var(--font-playfair), Georgia, "Times New Roman", serif';
  if (font === "elegant-serif") return 'var(--font-cormorant), Georgia, "Times New Roman", serif';
  if (font === "clean") return 'var(--font-geist-sans), Arial, "Helvetica Neue", sans-serif';
  return 'var(--font-cormorant), Georgia, "Times New Roman", serif';
}

export function getSignatureBodyFontFamily() {
  return 'Georgia, "Times New Roman", serif';
}

export function parseSignaturePhotos(value: unknown): SignaturePhoto[] {
  const raw =
    typeof value === "string"
      ? safeParseJson(value)
      : Array.isArray(value)
      ? value
      : [];

  if (!Array.isArray(raw)) return [];

  const photos: SignaturePhoto[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
      const record = item as Record<string, unknown>;
      const src = String(record.src ?? "").trim();
    if (!isSupportedPhotoSrc(src)) continue;

    photos.push({
      id: String(record.id ?? cryptoId(src)).slice(0, 80),
      src,
      caption: String(record.caption ?? "").trim().slice(0, 80) || undefined,
    });

    if (photos.length >= 3) break;
  }

  return photos;
}

export function hasSignatureAddOns({
  storedTheme,
  font,
  music,
  photos,
}: {
  storedTheme: SignatureTheme;
  font: SignatureFont;
  music: SignatureMusic;
  photos: SignaturePhoto[];
}) {
  return storedTheme !== "auto" || font !== "classic" || music !== "none" || photos.length > 0;
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function isSupportedPhotoSrc(src: string) {
  return (
    src.startsWith("data:image/") ||
    src.startsWith("https://") ||
    src.startsWith("http://")
  );
}

function cryptoId(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `photo-${Math.abs(hash)}`;
}
