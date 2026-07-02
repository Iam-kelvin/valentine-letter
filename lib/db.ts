import { sql } from "@vercel/postgres";
import type { SignatureFont, SignatureMusic, SignaturePhoto, SignatureTheme } from "@/lib/signature";

export const SIGNATURE_EDIT_LIMIT = 5;
export const SIGNATURE_REGENERATE_LIMIT = 2;

export async function saveLetter(data: {
  slug: string;
  userId: string;
  occasion: string;
  title: string;
  preview: string;
  letter: string;
  ps: string;
  senderName: string;
  recipientName: string;
  passwordHash: string | null;
  expiresAt: string | null;
  qualityTier?: "standard" | "premium" | "signature";
  languageMode?: string | null;
  nativeLanguage?: string | null;
  isPremium?: boolean;
}) {
  await ensureLettersMetadataColumns();

  const qualityTier = data.qualityTier === "premium" || data.qualityTier === "signature"
    ? "premium"
    : "standard";

  await sql`
    INSERT INTO letters (
      slug, user_id, occasion, title, preview, letter, ps,
      sender_name, recipient_name,
      password_hash, expires_at,
      quality_tier, language_mode, native_language, is_premium
    )
    VALUES (
      ${data.slug},
      ${data.userId},
      ${data.occasion},
      ${data.title},
      ${data.preview},
      ${data.letter},
      ${data.ps},
      ${data.senderName},
      ${data.recipientName},
      ${data.passwordHash},
      ${data.expiresAt},
      ${qualityTier},
      ${data.languageMode ?? "english"},
      ${data.nativeLanguage ?? null},
      ${data.isPremium ?? qualityTier === "premium"}
    )
  `;
}

export async function getLetter(slug: string) {
  await ensureLettersMetadataColumns();

  const { rows } = await sql`
    SELECT * FROM letters
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getLettersForUser(userId: string) {
  await ensureLettersMetadataColumns();

  const { rows } = await sql`
    SELECT slug, occasion, title, preview, sender_name, recipient_name, created_at, expires_at,
      quality_tier, is_premium
    FROM letters
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return rows;
}

export async function getReceivedLettersForUser(userId: string) {
  await ensureLettersMetadataColumns();
  await ensureLetterReceiptsTable();

  const { rows } = await sql`
    SELECT l.slug, l.occasion, l.title, l.preview, l.sender_name, l.recipient_name,
      l.created_at, r.created_at AS received_at, l.expires_at, l.quality_tier, l.is_premium
    FROM letter_receipts r
    JOIN letters l ON l.slug = r.slug
    WHERE r.user_id = ${userId}
      AND COALESCE(l.user_id, '') <> ${userId}
    ORDER BY r.created_at DESC
  `;

  return rows;
}

export async function recordLetterReceipt(slug: string, userId: string) {
  await ensureLettersMetadataColumns();
  await ensureLetterReceiptsTable();

  await sql`
    INSERT INTO letter_receipts (slug, user_id)
    VALUES (${slug}, ${userId})
    ON CONFLICT (slug, user_id) DO NOTHING
  `;
}

export async function getRecentLettersForUser(userId: string, limit = 3) {
  await ensureLettersMetadataColumns();

  const { rows } = await sql`
    SELECT slug, occasion, title, preview, sender_name, recipient_name, created_at, expires_at,
      quality_tier, is_premium
    FROM letters
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return rows;
}

export async function updateLetterToPremium(data: {
  slug: string;
  userId: string;
  title: string;
  preview: string;
  letter: string;
  ps: string;
  languageMode?: string | null;
  nativeLanguage?: string | null;
}) {
  await ensureLettersMetadataColumns();

  const { rows } = await sql`
    UPDATE letters
    SET title = ${data.title},
      preview = ${data.preview},
      letter = ${data.letter},
      ps = ${data.ps},
      quality_tier = 'premium',
      language_mode = ${data.languageMode ?? "english"},
      native_language = ${data.nativeLanguage ?? null},
      is_premium = TRUE
    WHERE slug = ${data.slug}
      AND user_id = ${data.userId}
    RETURNING *
  `;

  return rows[0] ?? null;
}

export async function updateSignatureAddOns(data: {
  slug: string;
  userId: string;
  title?: string;
  preview?: string;
  letter?: string;
  ps?: string;
  theme?: SignatureTheme;
  font?: SignatureFont;
  music?: SignatureMusic;
  photos?: SignaturePhoto[];
  photoBackground?: boolean;
  incrementEditCount?: boolean;
  incrementRegenerateCount?: boolean;
}) {
  await ensureLettersMetadataColumns();

  const photosJson = data.photos ? JSON.stringify(data.photos) : null;
  const incrementEdit = data.incrementEditCount === true;
  const incrementRegenerate = data.incrementRegenerateCount === true;

  const { rows } = await sql`
    UPDATE letters
    SET title = COALESCE(${data.title ?? null}, title),
      preview = COALESCE(${data.preview ?? null}, preview),
      letter = COALESCE(${data.letter ?? null}, letter),
      ps = COALESCE(${data.ps ?? null}, ps),
      signature_theme = COALESCE(${data.theme ?? null}, signature_theme),
      signature_font = COALESCE(${data.font ?? null}, signature_font),
      signature_music = COALESCE(${data.music ?? null}, signature_music),
      signature_photos = COALESCE(${photosJson}::jsonb, signature_photos),
      signature_photo_background = COALESCE(${data.photoBackground ?? null}, signature_photo_background),
      signature_edit_count = COALESCE(signature_edit_count, 0) + CASE WHEN ${incrementEdit} THEN 1 ELSE 0 END,
      signature_regenerate_count = COALESCE(signature_regenerate_count, 0) + CASE WHEN ${incrementRegenerate} THEN 1 ELSE 0 END
    WHERE slug = ${data.slug}
      AND user_id = ${data.userId}
      AND is_premium = TRUE
      AND COALESCE(signature_edit_count, 0) < CASE WHEN ${incrementEdit} THEN ${SIGNATURE_EDIT_LIMIT} ELSE 2147483647 END
      AND COALESCE(signature_regenerate_count, 0) < CASE WHEN ${incrementRegenerate} THEN ${SIGNATURE_REGENERATE_LIMIT} ELSE 2147483647 END
    RETURNING *
  `;

  return rows[0] ?? null;
}

let metadataColumnsReady = false;

async function ensureLettersMetadataColumns() {
  if (metadataColumnsReady) return;

  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS user_id TEXT
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS quality_tier TEXT DEFAULT 'standard'
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS language_mode TEXT DEFAULT 'english'
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS native_language TEXT
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS signature_theme TEXT DEFAULT 'auto'
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS signature_font TEXT DEFAULT 'classic'
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS signature_music TEXT DEFAULT 'none'
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS signature_photos JSONB DEFAULT '[]'::jsonb
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS signature_photo_background BOOLEAN DEFAULT FALSE
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS signature_edit_count INTEGER DEFAULT 0
  `;
  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS signature_regenerate_count INTEGER DEFAULT 0
  `;
  metadataColumnsReady = true;
}

let receiptTableReady = false;

async function ensureLetterReceiptsTable() {
  if (receiptTableReady) return;

  await sql`
    CREATE TABLE IF NOT EXISTS letter_receipts (
      slug TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (slug, user_id)
    )
  `;

  receiptTableReady = true;
}
