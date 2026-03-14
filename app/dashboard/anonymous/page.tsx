import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAnonymousMessagesForUser,
  getArchivedAnonymousMessagesForUser,
  getAnonymousProfileByUserId,
} from "@/lib/anonymous-db";
import ArchiveButton from "./archive-button";
import UnarchiveButton from "./unarchive-button";
import CopyLinkButton from "./copy-link-button";
import BackButton from "@/components/BackButton";
import {
  anonPageStyle,
  anonWrapStyle,
  anonBadgeStyle,
  anonTitleStyle,
  anonSubtitleStyle,
  anonCardStyle,
  anonMessageCardStyle,
  anonSecondaryButtonStyle,
} from "@/lib/anonymous-ui";

export default async function AnonymousDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/anonymous/sign-in");
  }

  const profile = await getAnonymousProfileByUserId(userId);
  if (!profile) {
    redirect("/dashboard/anonymous/setup");
  }

  const messages = await getAnonymousMessagesForUser(userId);
  const archivedMessages = await getArchivedAnonymousMessagesForUser(userId);

  const h = await headers();
  const host = h.get("host");
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

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={anonBadgeStyle}>📥 Your Inbox</div>
          <h1 style={anonTitleStyle}>Your Anonymous Inbox</h1>
          <p style={anonSubtitleStyle}>Your public link</p>
          <p style={{ fontSize: 16, opacity: 0.9, marginTop: 8 }}>{publicUrl}</p>
        </div>

        <div style={{ ...anonCardStyle, marginBottom: 24, textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href={`/u/${profile.username}`} style={anonSecondaryButtonStyle}>
              Open public page
            </Link>
            <CopyLinkButton url={publicUrl} />
          </div>
        </div>

        <h2 style={{ fontSize: 26, marginBottom: 16 }}>Messages</h2>

        {messages.length === 0 ? (
          <div style={anonCardStyle}>
            <p style={{ margin: 0, opacity: 0.75 }}>No active messages.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16, marginBottom: 28 }}>
            {messages.map((m: any) => (
              <div key={m.id} style={anonMessageCardStyle}>
                <p style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700 }}>
                  {m.message}
                </p>
                <small style={{ opacity: 0.72 }}>
                  {new Date(m.created_at).toLocaleString()}
                </small>

                <div style={{ marginTop: 14 }}>
                  <ArchiveButton messageId={m.id} />
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ fontSize: 26, marginBottom: 16 }}>Archived</h2>

        {archivedMessages.length === 0 ? (
          <div style={anonCardStyle}>
            <p style={{ margin: 0, opacity: 0.75 }}>No archived messages.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {archivedMessages.map((m: any) => (
              <div key={m.id} style={anonMessageCardStyle}>
                <p style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700 }}>
                  {m.message}
                </p>
                <small style={{ opacity: 0.72 }}>
                  {new Date(m.created_at).toLocaleString()}
                </small>

                <div style={{ marginTop: 14 }}>
                  <UnarchiveButton messageId={m.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
