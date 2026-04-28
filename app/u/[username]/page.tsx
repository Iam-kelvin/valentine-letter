import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getAnonymousProfileByUsername } from "@/lib/anonymous-db";
import AnonymousSendForm from "./send-form";
import BackButton from "@/components/BackButton";
import {
  anonPageStyle,
  anonWrapStyle,
  anonHeroStyle,
  anonBadgeStyle,
  anonTitleStyle,
  anonSubtitleStyle,
  anonCardStyle,
} from "@/lib/anonymous-ui";

export default async function PublicAnonymousPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getAnonymousProfileByUsername(username);

  if (!profile) return notFound();

  const { userId } = await auth();
  const isOwner = userId && profile.user_id === userId;
  const h = await headers();
  const host = h.get("host") || "letterly-orcin.vercel.app";
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  const publicUrl = `${proto}://${host}/u/${profile.username}`;

  return (
    <main style={anonPageStyle}>
      <div style={anonWrapStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <Link
            href="/"
            style={{
              color: "rgba(255,255,255,0.82)",
              textDecoration: "none",
              fontSize: 16,
            }}
          >
            ← Home
          </Link>

          <BackButton />
        </div>

        <div style={anonHeroStyle}>
          <div style={anonBadgeStyle}>👀 Anonymous Inbox</div>
          <h1 style={anonTitleStyle}>Send an anonymous message</h1>
          <p style={anonSubtitleStyle}>to {publicUrl}</p>
        </div>

        {isOwner ? (
          <div style={{ ...anonCardStyle, textAlign: "center" }}>
            <p style={{ fontSize: 20, marginTop: 0 }}>
              This is your own anonymous link.
            </p>
            <p style={{ opacity: 0.78 }}>
              Share it with other people to receive messages.
            </p>
            <p
              style={{
                margin: "14px auto 0",
                maxWidth: 720,
                overflowWrap: "anywhere",
                opacity: 0.92,
                fontSize: 16,
              }}
            >
              {publicUrl}
            </p>
          </div>
        ) : (
          <AnonymousSendForm
            username={profile.username}
            profileId={profile.id}
          />
        )}
      </div>
    </main>
  );
}
