import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function createAnonymousProfile(input: {
  userId: string;
  username: string;
  displayName?: string;
  bio?: string;
}) {
  const rows = await sql`
    INSERT INTO anonymous_profiles (user_id, username, display_name, bio)
    VALUES (${input.userId}, ${input.username}, ${input.displayName ?? null}, ${input.bio ?? null})
    RETURNING *;
  `;
  return rows[0];
}

export async function getAnonymousProfileByUsername(username: string) {
  const rows = await sql`
    SELECT * FROM anonymous_profiles
    WHERE username = ${username}
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function getAnonymousProfileByUserId(userId: string) {
  const rows = await sql`
    SELECT * FROM anonymous_profiles
    WHERE user_id = ${userId}
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function createAnonymousMessage(input: {
  profileId: number;
  message: string;
  senderHint?: string;
}) {
  const rows = await sql`
    INSERT INTO anonymous_messages (profile_id, message, sender_hint)
    VALUES (${input.profileId}, ${input.message}, ${input.senderHint ?? null})
    RETURNING *;
  `;
  return rows[0];
}

export async function getAnonymousMessagesForUser(userId: string) {
  const rows = await sql`
    SELECT m.*
    FROM anonymous_messages m
    JOIN anonymous_profiles p ON p.id = m.profile_id
    WHERE p.user_id = ${userId}
      AND m.is_deleted = FALSE
      AND m.is_archived = FALSE
    ORDER BY m.created_at DESC;
  `;
  return rows;
}

export async function archiveAnonymousMessage(input: {
  messageId: number;
  userId: string;
}) {
  const rows = await sql`
    UPDATE anonymous_messages m
    SET is_archived = TRUE
    FROM anonymous_profiles p
    WHERE m.profile_id = p.id
      AND p.user_id = ${input.userId}
      AND m.id = ${input.messageId}
    RETURNING m.*;
  `;
  return rows[0] ?? null;
}

export async function checkAnonymousRateLimit(input: {
  ip: string;
  profileId: number;
}) {
  const recent = await sql`
    SELECT COUNT(*)::int AS count
    FROM anonymous_rate_limits
    WHERE ip = ${input.ip}
      AND profile_id = ${input.profileId}
      AND created_at > NOW() - INTERVAL '5 minutes';
  `;

  const count = recent[0]?.count ?? 0;
  return count < 3;
}

export async function logAnonymousRateLimitHit(input: {
  ip: string;
  profileId: number;
}) {
  await sql`
    INSERT INTO anonymous_rate_limits (ip, profile_id)
    VALUES (${input.ip}, ${input.profileId});
  `;
}