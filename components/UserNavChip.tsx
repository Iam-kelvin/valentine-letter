"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

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
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="group flex items-center gap-2 rounded-full border border-transparent px-1.5 py-1 transition hover:border-white/12 hover:bg-white/[0.045] focus:outline-none focus:ring-2 focus:ring-rose-100/30"
      >
        <span className="max-w-36 truncate text-sm font-semibold text-white/78 transition group-hover:text-white">
          {name}
        </span>
        <Avatar initial={initial} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 rounded-2xl border border-white/12 bg-[#12060a]/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="min-w-0 px-2 pb-3">
            <p className="truncate text-sm font-bold text-white">{name}</p>
            {email ? <p className="truncate text-xs text-white/52">{email}</p> : null}
          </div>
          <SignOutButton>
            <button
              role="menuitem"
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2 text-left text-sm font-bold text-white/78 transition hover:border-white/24 hover:bg-white/[0.09] hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-100/30"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      ) : null}
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
