import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getAnonymousMessagesForUser,
  getAnonymousProfileByUserId,
} from "@/lib/anonymous-db";
import ArchiveButton from "./archive-button";
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
  const publicUrl = `/u/${profile.username}`;

  return (
    <main style={anonPageStyle}>
      <div style={anonWrapStyle}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={anonBadgeStyle}>📥 Your Inbox</div>
          <h1 style={anonTitleStyle}>Your Anonymous Inbox</h1>
          <p style={anonSubtitleStyle}>
            Your public link: <strong>{publicUrl}</strong>
          </p>
        </div>

        <div style={{ ...anonCardStyle, marginBottom: 20, textAlign: "center" }}>
          <Link href={publicUrl} style={anonSecondaryButtonStyle}>
            Open public page
          </Link>
        </div>

        <h2 style={{ fontSize: 28, marginBottom: 16 }}>Messages</h2>

        {messages.length === 0 ? (
          <div style={anonCardStyle}>
            <p style={{ margin: 0, opacity: 0.75 }}>No messages yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {messages.map((m: any) => (
              <div key={m.id} style={anonMessageCardStyle}>
                <p style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 600 }}>
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
      </div>
    </main>
  );
}