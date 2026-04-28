"use client";

import { SignOutButton } from "@clerk/nextjs";

type UserNavChipProps = {
  name: string;
  email?: string | null;
  initial: string;
  compact?: boolean;
};

export default function UserNavChip({
  name,
  email,
  initial,
  compact = false,
}: UserNavChipProps) {
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar initial={initial} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{name}</p>
            {email ? <p className="truncate text-xs text-white/50">{email}</p> : null}
          </div>
        </div>
        <SignOutButton>
          <button className="shrink-0 rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/72 transition hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.09] hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-100/30">
            Sign out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2 rounded-full border border-transparent px-1.5 py-1 transition hover:border-white/12 hover:bg-white/[0.045]">
      <span className="max-w-36 truncate text-sm font-semibold text-white/78 transition group-hover:text-white">
        {name}
      </span>
      <Avatar initial={initial} />
    </div>
  );
}

function Avatar({ initial }: { initial: string }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-600 text-sm font-bold text-white">
      {initial}
    </span>
  );
}
