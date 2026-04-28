import Link from "next/link";
import type { CSSProperties } from "react";

type RecentLetter = {
  slug: string;
  occasion: string;
  title: string;
  preview: string;
};

type HomeHeroProps = {
  isSignedIn: boolean;
  recentLetters?: RecentLetter[];
  inboxCount?: number;
  anonymousLink?: string | null;
};

const heroOccasions = [
  {
    label: "Love",
    emoji: "❤️",
    href: "/create/love",
    line: "Romantic, honest, soft, or bold.",
  },
  {
    label: "Birthday",
    emoji: "🎂",
    href: "/create/birthday",
    line: "Warm words for their day.",
  },
  {
    label: "Mother's Day",
    emoji: "🌸",
    href: "/create/mothers-day",
    line: "Honor care, sacrifice, and presence.",
  },
  {
    label: "Appreciation",
    emoji: "🙏",
    href: "/create/appreciation",
    line: "Thank you, but unforgettable.",
  },
  {
    label: "Anonymous",
    emoji: "👀",
    href: "/anonymous",
    line: "Open your private inbox flow.",
  },
];

export function HomeHero({
  isSignedIn,
  recentLetters = [],
  inboxCount = 0,
  anonymousLink,
}: HomeHeroProps) {
  return (
    <section className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-5 pb-14 pt-16 sm:px-8 lg:grid-cols-[1fr_0.92fr] lg:px-10">
      <style>{`
        @keyframes letterlyTypeLine {
          0%, 10% { width: 0; opacity: 0.5; }
          42%, 82% { width: var(--target-width); opacity: 1; }
          100% { width: 0; opacity: 0.45; }
        }

        @keyframes letterlyFloat {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
          50% { transform: translate3d(0, -12px, 0) rotate(2deg); }
        }

        @keyframes letterlyDrift {
          0% { opacity: 0; transform: translate3d(0, 18px, 0) scale(0.88); }
          18% { opacity: 0.55; }
          100% { opacity: 0; transform: translate3d(18px, -160px, 0) scale(1.08); }
        }
      `}</style>

      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-white/74 shadow-2xl shadow-black/30">
          <span className="h-2 w-2 rounded-full bg-rose-200 shadow-[0_0_18px_rgba(251,113,133,0.9)]" />
          Letterly
        </div>

        <h1 className="max-w-5xl text-4xl font-semibold leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
          Say what you actually mean.
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
          Create personal letters for love, birthdays, Mother&apos;s Day,
          Father&apos;s Day, appreciation, anonymous messages, and the moments
          that deserve better than a quick text.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={isSignedIn ? "/create" : "/sign-up"}
            className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-zinc-950 shadow-[0_24px_80px_rgba(255,255,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-rose-50"
          >
            {isSignedIn ? "Write my letter" : "Create free account"}
          </Link>
          <a
            href="#occasions"
            className="rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-center text-sm font-bold text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]"
          >
            Choose occasion
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {heroOccasions.map((occasion) => (
            <Link
              key={occasion.href}
              href={occasion.href}
              className="group min-w-0 rounded-3xl border border-white/12 bg-white/[0.045] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.20)] transition duration-200 hover:-translate-y-1 hover:border-rose-100/25 hover:bg-white/[0.075]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl">{occasion.emoji}</span>
                <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70">
                  →
                </span>
              </div>
              <h2 className="mt-4 text-base font-bold leading-tight text-white">{occasion.label}</h2>
              <p className="mt-2 text-xs leading-5 text-white/55">{occasion.line}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-8 rounded-[2.5rem] bg-rose-500/10 blur-3xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-black/38 p-5 shadow-[0_35px_120px_rgba(0,0,0,0.48)] backdrop-blur">
          <AnimatedLetterPreview />

          {isSignedIn ? (
            <SignedInPanel
              recentLetters={recentLetters}
              inboxCount={inboxCount}
              anonymousLink={anonymousLink}
            />
          ) : (
            <PublicProofPanel />
          )}
        </div>
      </div>
    </section>
  );
}

function AnimatedLetterPreview() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.035))] p-6">
      <div className="pointer-events-none absolute inset-0">
        {["💌", "✨", "🌸", "❤️", "🎈"].map((symbol, index) => (
          <span
            key={symbol}
            className="absolute text-xl"
            style={{
              left: `${12 + index * 18}%`,
              bottom: `${-8 - index * 4}px`,
              animation: `letterlyDrift ${5.2 + index * 0.45}s ease-in-out ${index * 0.55}s infinite`,
            }}
          >
            {symbol}
          </span>
        ))}
      </div>

      <div className="relative z-10">
        <div className="mb-7 flex items-center justify-between">
          <span className="rounded-full border border-rose-200/15 bg-rose-100/10 px-3 py-1 text-xs font-bold text-rose-100/80">
            Mother&apos;s Day · heartfelt
          </span>
          <span className="text-xl" style={{ animation: "letterlyFloat 4s ease-in-out infinite" }}>
            💐
          </span>
        </div>

        <p className="text-2xl font-semibold leading-snug text-white">
          &ldquo;Now I see your love in everything.&rdquo;
        </p>

        <div className="mt-8 space-y-3">
          {["82%", "68%", "74%", "54%"].map((width, index) => (
            <div key={width} className="h-3 rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-rose-100/28"
                style={{
                  "--target-width": width,
                  animation: `letterlyTypeLine 5.8s ease-in-out ${index * 0.42}s infinite`,
                } as CSSProperties}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {["Saved", "Private", "Shareable"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-3 text-center text-xs font-bold text-white/68"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublicProofPanel() {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        <p className="text-2xl font-semibold text-white">8</p>
        <p className="mt-1 text-xs leading-5 text-white/55">occasion flows</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        <p className="text-2xl font-semibold text-white">PG-13</p>
        <p className="mt-1 text-xs leading-5 text-white/55">for cheeky notes</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        <p className="text-2xl font-semibold text-white">Inbox</p>
        <p className="mt-1 text-xs leading-5 text-white/55">for anonymous messages</p>
      </div>
    </div>
  );
}

function SignedInPanel({
  recentLetters,
  inboxCount,
  anonymousLink,
}: {
  recentLetters: RecentLetter[];
  inboxCount: number;
  anonymousLink?: string | null;
}) {
  return (
    <div className="mt-4 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/letters"
          className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:bg-white/[0.075]"
        >
          <p className="text-sm font-bold text-white">My letters</p>
          <p className="mt-1 text-xs leading-5 text-white/55">
            {recentLetters.length ? "Open recent messages" : "Start your first saved letter"}
          </p>
        </Link>
        <Link
          href="/dashboard/anonymous"
          className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:bg-white/[0.075]"
        >
          <p className="text-sm font-bold text-white">Inbox</p>
          <p className="mt-1 text-xs leading-5 text-white/55">
            {inboxCount} active anonymous {inboxCount === 1 ? "message" : "messages"}
          </p>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-white">Recent</p>
          <Link href="/create" className="text-xs font-bold text-rose-100/80">
            Write →
          </Link>
        </div>

        <div className="mt-3 space-y-3">
          {recentLetters.length ? (
            recentLetters.map((letter) => (
              <Link
                key={letter.slug}
                href={`/l/${letter.slug}`}
                className="block rounded-xl border border-white/8 bg-black/16 px-3 py-3 transition hover:bg-white/[0.055]"
              >
                <p className="truncate text-sm font-semibold text-white">{letter.title}</p>
                <p className="mt-1 truncate text-xs text-white/48">
                  {letter.occasion.replaceAll("-", " ")} · {letter.preview}
                </p>
              </Link>
            ))
          ) : (
            <p className="rounded-xl border border-white/8 bg-black/16 px-3 py-3 text-sm text-white/55">
              Your saved letters will appear here.
            </p>
          )}
        </div>
      </div>

      {anonymousLink ? (
        <Link
          href={anonymousLink}
          className="rounded-2xl border border-rose-100/15 bg-rose-100/[0.06] p-4 text-sm font-bold text-rose-100/85 transition hover:bg-rose-100/[0.10]"
        >
          Open your public anonymous link →
        </Link>
      ) : null}
    </div>
  );
}
