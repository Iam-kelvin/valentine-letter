import { sql } from "@vercel/postgres";

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
}) {
  await ensureLettersUserIdColumn();

  await sql`
    INSERT INTO letters (
      slug, user_id, occasion, title, preview, letter, ps,
      sender_name, recipient_name,
      password_hash, expires_at
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
      ${data.expiresAt}
    )
  `;
}

export async function getLetter(slug: string) {
  const { rows } = await sql`
    SELECT * FROM letters
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getLettersForUser(userId: string) {
  await ensureLettersUserIdColumn();

  const { rows } = await sql`
    SELECT slug, occasion, title, preview, sender_name, recipient_name, created_at, expires_at
    FROM letters
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return rows;
}

let userIdColumnReady = false;

async function ensureLettersUserIdColumn() {
  if (userIdColumnReady) return;

  await sql`
    ALTER TABLE letters
    ADD COLUMN IF NOT EXISTS user_id TEXT
  `;

  userIdColumnReady = true;
}
