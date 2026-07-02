import Link from "next/link";
import { OCCASIONS } from "@/lib/occasions";

const occasions = [
  ...Object.values(OCCASIONS).map((occasion) => ({
    title: occasion.label,
    emoji: occasion.emoji,
    description: occasion.subtitle,
    href: occasion.path,
  })),
  {
    title: "Anonymous",
    emoji: "👀",
    description: "Create a private link and read anonymous messages in your inbox.",
    href: "/anonymous",
  },
];

export function OccasionCards() {
  return (
    <section id="occasions" className="relative px-5 py-20 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_0%,rgba(244,63,94,0.14),transparent_32%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-200/70">
              Start here
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Made for every kind of message
            </h2>
          </div>
          <Link
            href="/create"
            className="inline-flex rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/82 transition hover:border-white/25 hover:bg-white/[0.08]"
          >
            View all occasions →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <Link
              key={occasion.href}
              href={occasion.href}
              className="group rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-1 hover:border-white/24 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-3xl">{occasion.emoji}</div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{occasion.title}</h3>
                </div>
                <span className="mt-1 text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70">
                  →
                </span>
              </div>
              <p className="mt-4 min-h-14 text-sm leading-6 text-white/65">{occasion.description}</p>
              <p className="mt-6 text-sm font-semibold text-rose-100/85">
                {occasion.href === "/anonymous" ? "Open anonymous →" : "Create letter →"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
