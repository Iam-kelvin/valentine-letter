import Link from "next/link";
import { OCCASIONS } from "@/lib/occasions";

const primaryOccasions = [
  "love",
  "mothers-day",
  "fathers-day",
  "womens-day",
  "birthday",
  "appreciation",
  "just-because",
  "cheeky",
] as const;

export default function CreatePage() {
  const occasions = primaryOccasions.map((key) => OCCASIONS[key]);

  return (
    <main className="min-h-screen bg-[#050305] px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.18),transparent_34%),radial-gradient(circle_at_12%_22%,rgba(190,18,60,0.12),transparent_28%)]" />

      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-white/68 transition hover:text-white">
          ← Home
        </Link>

        <section className="max-w-3xl pb-10 pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-200/70">
            Choose an occasion
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight text-white sm:text-6xl">
            What are you trying to say?
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/65">
            Pick the moment first. Letterly will shape the prompts, tone, and examples
            around the kind of message you want to send.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((occasion) => (
            <Link
              key={occasion.key}
              href={occasion.path}
              className="group rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-1 hover:border-white/24 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-3xl">{occasion.emoji}</span>
                <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70">
                  →
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">{occasion.label}</h2>
              <p className="mt-4 text-sm leading-6 text-white/64">{occasion.subtitle}</p>
            </Link>
          ))}

          <Link
            href="/anonymous"
            className="group rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-1 hover:border-white/24 hover:bg-white/[0.07]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="text-3xl">👀</span>
              <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70">
                →
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-white">Anonymous Messages</h2>
            <p className="mt-4 text-sm leading-6 text-white/64">
              Create your private link and read anonymous messages from your dashboard.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
