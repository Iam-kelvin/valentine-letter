import { sql } from "@vercel/postgres";

export async function saveLetter(data: {
  slug: string;
  title: string;
  preview: string;
  letter: string;
  ps: string;
  senderName: string;
  recipientName: string;
  passwordHash: string | null;
  expiresAt: string | null;
}) {
  await sql`
    INSERT INTO letters (
      slug, title, preview, letter, ps,
      sender_name, recipient_name,
      password_hash, expires_at
    )
    VALUES (
      ${data.slug},
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