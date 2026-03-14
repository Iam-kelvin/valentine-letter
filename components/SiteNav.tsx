import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { getAnonymousProfileByUserId } from "@/lib/anonymous-db";

export default async function SiteNav() {
  const { userId } = await auth();
  const profile = userId ? await getAnonymousProfileByUserId(userId) : null;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        background: "rgba(10,10,14,0.72)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "-0.02em",
          }}
        >
          Send With Love
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <Link href="/" style={navLinkStyle}>
            Home
          </Link>

          <Link href="/anonymous" style={navLinkStyle}>
            Anonymous
          </Link>

          {userId ? (
            <>
              <Link href="/dashboard/anonymous" style={navLinkStyle}>
                Dashboard
              </Link>

              {profile ? (
                <Link href={`/u/${profile.username}`} style={navLinkStyle}>
                  My Link
                </Link>
              ) : null}

              <UserButton />
            </>
          ) : (
            <SignInButton mode="redirect" forceRedirectUrl="/dashboard/anonymous">
              <button style={navButtonStyle}>Sign in</button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.84)",
  textDecoration: "none",
  fontSize: 15,
  fontWeight: 500,
};

const navButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 600,
};