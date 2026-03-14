import { notFound } from "next/navigation";
import { getAnonymousProfileByUsername } from "@/lib/anonymous-db";
import AnonymousSendForm from "./send-form";
import {
  anonPageStyle,
  anonWrapStyle,
  anonHeroStyle,
  anonBadgeStyle,
  anonTitleStyle,
  anonSubtitleStyle,
} from "@/lib/anonymous-ui";

export default async function PublicAnonymousPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getAnonymousProfileByUsername(username);

  if (!profile) return notFound();

  return (
    <main style={anonPageStyle}>
      <div style={anonWrapStyle}>
        <div style={anonHeroStyle}>
          <div style={anonBadgeStyle}>👀 Anonymous Inbox</div>
          <h1 style={anonTitleStyle}>Send an anonymous message</h1>
          <p style={anonSubtitleStyle}>to @{profile.username}</p>
        </div>

        <AnonymousSendForm
          username={profile.username}
          profileId={profile.id}
        />
      </div>
    </main>
  );
}