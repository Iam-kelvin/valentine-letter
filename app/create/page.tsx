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
    <main className="relative min-h-screen overflow-hidden bg-[#250712] px-5 py-8 text-white sm:px-8 lg:px-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(251,113,133,0.24),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(251,191,36,0.12),transparent_26%),radial-gradient(circle_at_50%_110%,rgba(168,85,247,0.10),transparent_34%),linear-gradient(180deg,#3a0d1a_0%,#210711_42%,#110508_100%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-white/[0.055] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-white/68 transition hover:text-white">
          ← Home
        </Link>

        <section className="max-w-3xl pb-10 pt-14 sm:pt-16">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-200/70">
            Choose an occasion
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-6xl">
            What are you trying to say?
          </h1>
          <p className="mt-5 text-base leading-8 text-white/65 sm:text-lg">
            Pick the moment first. Letterly will shape the prompts, tone, and examples
            around the kind of message you want to send.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((occasion) => (
            <Link
              key={occasion.key}
              href={occasion.path}
              className="group min-w-0 rounded-3xl border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.035))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-rose-100/30 hover:bg-white/[0.10]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-3xl">{occasion.emoji}</span>
                <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70">
                  →
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-semibold leading-tight text-white">
                {occasion.label}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/64">{occasion.subtitle}</p>
            </Link>
          ))}

          <Link
            href="/anonymous"
            className="group min-w-0 rounded-3xl border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.035))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-rose-100/30 hover:bg-white/[0.10]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="text-3xl">👀</span>
              <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70">
                →
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold leading-tight text-white">
              Anonymous Messages
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/64">
              Create your private link and read anonymous messages from your dashboard.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
