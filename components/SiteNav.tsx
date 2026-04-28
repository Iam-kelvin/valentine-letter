import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { getAnonymousProfileByUserId } from "@/lib/anonymous-db";

export default async function SiteNav() {
  const { userId } = await auth();
  const profile = userId ? await getAnonymousProfileByUserId(userId) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-normal text-white no-underline"
        >
          Letterly
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-3">
          <Link href="/create" className={navLinkClass}>
            Write
          </Link>

          {userId ? (
            <>
              <Link href="/dashboard/letters" className={navLinkClass}>
                My letters
              </Link>
              <Link href="/dashboard/anonymous" className={navLinkClass}>
                Inbox
              </Link>
              {profile ? (
                <Link href={`/u/${profile.username}`} className={navLinkClass}>
                  My Link
                </Link>
              ) : null}
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/anonymous" className={navLinkClass}>
                Anonymous
              </Link>
              <SignInButton mode="redirect" forceRedirectUrl="/create">
                <button className={navGhostButtonClass}>Sign in</button>
              </SignInButton>
              <SignUpButton mode="redirect" forceRedirectUrl="/create">
                <button className={navButtonClass}>Create account</button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const navLinkClass =
  "text-sm font-semibold text-white/76 no-underline transition hover:text-white";

const navGhostButtonClass =
  "cursor-pointer rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition hover:bg-white/[0.08]";

const navButtonClass =
  "cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-rose-50";
