import Link from "next/link";

export function FinalCta() {
  return (
    <section className="px-5 pb-28 pt-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/12 bg-white/[0.06] px-7 py-14 text-center shadow-[0_32px_110px_rgba(0,0,0,0.32)] sm:px-12 sm:py-16">
        <h2 className="text-3xl font-semibold leading-tight text-white sm:text-5xl">
          Your words are already there.
          <br />
          Let&apos;s help you say them better.
        </h2>
        <Link
          href="/create"
          className="mt-9 inline-flex rounded-2xl bg-white px-7 py-4 text-sm font-bold text-zinc-950 shadow-[0_24px_80px_rgba(255,255,255,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-rose-50"
        >
          Start writing
        </Link>
      </div>
    </section>
  );
}
