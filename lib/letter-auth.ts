import crypto from "crypto";

const SIGNING_SECRET = process.env.LETTER_SIGNING_SECRET || "";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 32);
  return `scrypt:${salt.toString("base64")}:${derived.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algo, saltB64, hashB64] = stored.split(":");
  if (algo !== "scrypt") return false;

  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  const actual = crypto.scryptSync(password, salt, expected.length);

  return crypto.timingSafeEqual(expected, actual);
}

export function cookieNameForSlug(slug: string) {
  return `letter_access_${slug}`;
}

export function makeAccessToken(slug: string, expiresAtIso: string | null) {
  if (!SIGNING_SECRET) throw new Error("Missing LETTER_SIGNING_SECRET");

  const now = Date.now();
  const max7d = now + 7 * 24 * 60 * 60 * 1000;
  const letterExp = expiresAtIso ? new Date(expiresAtIso).getTime() : Infinity;
  const exp = Math.min(max7d, letterExp);

  const payload = `${slug}.${exp}`;
  const sig = crypto.createHmac("sha256", SIGNING_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAccessToken(token: string, slug: string) {
  if (!SIGNING_SECRET) return false;

  const [tSlug, expStr, sig] = token.split(".");
  if (tSlug !== slug) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const payload = `${tSlug}.${expStr}`;
  const expected = crypto.createHmac("sha256", SIGNING_SECRET).update(payload).digest("base64url");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}