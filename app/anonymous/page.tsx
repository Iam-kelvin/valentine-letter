import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAnonymousProfileByUserId } from "@/lib/anonymous-db";
import BackButton from "@/components/BackButton";
import {
  anonPageStyle,
  anonWrapStyle,
  anonHeroStyle,
  anonBadgeStyle,
  anonTitleStyle,
  anonSubtitleStyle,
  anonCardStyle,
  anonButtonStyle,
  anonSecondaryButtonStyle,
} from "@/lib/anonymous-ui";

export default async function AnonymousLanding() {
  const { userId } = await auth();

  if (userId) {
    const profile = await getAnonymousProfileByUserId(userId);

    if (profile) {
      redirect("/dashboard/anonymous");
    }

    redirect("/dashboard/anonymous/setup");
  }

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
          <div style={anonBadgeStyle}>👀 Anonymous Messages</div>
          <h1 style={anonTitleStyle}>Get honest messages without the pressure.</h1>
          <p style={anonSubtitleStyle}>
            Create your own private link and let people send you anonymous messages.
          </p>
        </div>

        <div style={{ ...anonCardStyle, textAlign: "center" }}>
          <div style={{ fontSize: 46, marginBottom: 10 }}>💌</div>
          <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 24 }}>
            Your own anonymous inbox
          </h2>
          <p style={{ opacity: 0.8, marginBottom: 22 }}>
            Share your link. Get anonymous messages. Read them in your private dashboard.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/anonymous/sign-up" style={anonButtonStyle}>
              Get my link
            </Link>
            <Link href="/anonymous/sign-in" style={anonSecondaryButtonStyle}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
