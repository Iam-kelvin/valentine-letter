"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useState } from "react";
import UserNavChip from "./UserNavChip";

type MobileNavProps = {
  isSignedIn: boolean;
  publicLink?: string | null;
  userName?: string;
  userEmail?: string | null;
  userInitial?: string;
};

export default function MobileNav({
  isSignedIn,
  publicLink,
  userName = "Account",
  userEmail,
  userInitial = "U",
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Toggle navigation"
        className="grid h-10 w-10 place-items-center rounded-2xl border border-white/12 bg-white/[0.055] text-white"
      >
        <span className="grid gap-1.5">
          <span className="block h-0.5 w-5 rounded-full bg-white" />
          <span className="block h-0.5 w-5 rounded-full bg-white/80" />
          <span className="block h-0.5 w-5 rounded-full bg-white/60" />
        </span>
      </button>

      {open ? (
        <div className="absolute inset-x-3 top-[calc(100%+8px)] rounded-3xl border border-white/12 bg-[#12060a]/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="grid gap-1">
            <MobileLink href="/create" onClick={close}>
              Write
            </MobileLink>

            {isSignedIn ? (
              <>
                <MobileLink href="/dashboard/letters" onClick={close}>
                  My letters
                </MobileLink>
                <MobileLink href="/dashboard/anonymous" onClick={close}>
                  Inbox
                </MobileLink>
                {publicLink ? (
                  <MobileLink href={publicLink} onClick={close}>
                    My Link
                  </MobileLink>
                ) : null}
                <div className="mt-2 border-t border-white/10 pt-3">
                  <UserNavChip
                    compact
                    name={userName}
                    email={userEmail}
                    initial={userInitial}
                  />
                </div>
              </>
            ) : (
              <>
                <MobileLink href="/anonymous" onClick={close}>
                  Anonymous
                </MobileLink>
                <div className="mt-2 grid gap-2 border-t border-white/10 pt-3">
                  <SignInButton mode="redirect" forceRedirectUrl="/create">
                    <button className="rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-rose-100/35">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="redirect" forceRedirectUrl="/create">
                    <button className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-100/45">
                      Create account
                    </button>
                  </SignUpButton>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-2xl px-3 py-3 text-sm font-bold text-white/82 no-underline transition hover:bg-white/[0.06] hover:text-white"
    >
      {children}
    </Link>
  );
}
