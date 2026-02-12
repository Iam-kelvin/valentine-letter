import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import UnlockBox from "./unlock-box";
import { getLetter } from "@/lib/db";
import { cookieNameForSlug, verifyAccessToken } from "@/lib/letter-auth";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getLetter(slug);
  if (!row) return {};

  return {
    title: row.title,
    description: row.preview,
    openGraph: {
      title: row.title,
      description: row.preview,
      type: "website",
    },
  };
}

export default async function LetterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getLetter(slug);
  if (!row) return notFound();

  if (row.expires_at && new Date(row.expires_at) < new Date()) return notFound();

  const needsPassword = !!row.password_hash;
  let unlocked = !needsPassword;

  if (needsPassword) {
    const jar = await cookies();
    const token = jar.get(cookieNameForSlug(slug))?.value;
    unlocked = token ? verifyAccessToken(token, slug) : false;
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 28, lineHeight: 1.7 }}>
      <a href="/" style={{ display: "inline-block", marginBottom: 16, opacity: 0.85 }}>
        ← Home
      </a>

      <h1 style={{ fontSize: 34, marginBottom: 6 }}>{row.title}</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>{row.preview}</p>

      {!unlocked ? (
        <UnlockBox slug={slug} />
      ) : (
        <>
          <article style={{ whiteSpace: "pre-wrap", fontSize: 18 }}>{row.letter}</article>
          {row.ps?.trim() ? <p style={{ marginTop: 18, fontStyle: "italic" }}>PS: {row.ps}</p> : null}
        </>
      )}

      {row.expires_at ? (
        <p style={{ marginTop: 18, opacity: 0.65, fontSize: 13 }}>
          Expires: {new Date(row.expires_at).toLocaleString()}
        </p>
      ) : null}
    </main>
  );
}