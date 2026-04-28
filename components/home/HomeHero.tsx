import Link from "next/link";

const quickOccasions = [
  { label: "Love", href: "/create/love" },
  { label: "Mother's Day", href: "/create/mothers-day" },
  { label: "Birthday", href: "/create/birthday" },
  { label: "Anonymous", href: "/anonymous" },
];

export function HomeHero() {
  return (
    <section className="mx-auto grid min-h-[82vh] max-w-6xl items-center gap-12 px-6 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:text-left">
      <div className="text-center lg:text-left">
        <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 shadow-2xl shadow-black/30">
          Letterly
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[0.96] tracking-normal text-white sm:text-6xl lg:mx-0 lg:text-7xl">
          Say what you actually mean.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg lg:mx-0">
          Letterly helps you create beautiful, personal messages for love,
          appreciation, Mother&apos;s Day, Father&apos;s Day, and the moments that
          matter.
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row lg:justify-start">
          <Link
            href="/create"
            className="w-full rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-zinc-950 shadow-[0_24px_80px_rgba(255,255,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-rose-50 sm:w-auto"
          >
            Write my letter
          </Link>
          <a
            href="#occasions"
            className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-center text-sm font-bold text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] sm:w-auto"
          >
            Choose occasion
          </a>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
          {quickOccasions.map((occasion) => (
            <Link
              key={occasion.href}
              href={occasion.href}
              className="rounded-full border border-white/12 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-white/72 transition hover:border-rose-100/35 hover:bg-white/[0.075] hover:text-white"
            >
              {occasion.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-md lg:mx-0">
        <div className="absolute -inset-6 rounded-[2rem] bg-rose-500/10 blur-3xl" />
        <div className="relative rounded-[2rem] border border-white/12 bg-black/35 p-5 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-full border border-rose-200/15 bg-rose-100/10 px-3 py-1 text-xs font-bold text-rose-100/80">
                Love
              </span>
              <span className="text-xl">💌</span>
            </div>
            <p className="text-2xl font-semibold leading-snug text-white">
              &ldquo;You make love feel safe, warm, and honest.&rdquo;
            </p>
            <div className="mt-8 space-y-3">
              <div className="h-3 w-11/12 rounded-full bg-white/12" />
              <div className="h-3 w-9/12 rounded-full bg-white/10" />
              <div className="h-3 w-7/12 rounded-full bg-white/8" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/dashboard/letters"
              className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm font-semibold text-white/80 transition hover:bg-white/[0.075]"
            >
              Sent letters
            </Link>
            <Link
              href="/anonymous"
              className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm font-semibold text-white/80 transition hover:bg-white/[0.075]"
            >
              Anonymous inbox
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
