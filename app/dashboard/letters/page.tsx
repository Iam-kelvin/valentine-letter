import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLettersForUser } from "@/lib/db";

export default async function LettersDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const letters = await getLettersForUser(userId);

  return (
    <main className="min-h-screen bg-[#050305] px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.16),transparent_34%),radial-gradient(circle_at_12%_22%,rgba(190,18,60,0.12),transparent_28%)]" />

      <div className="mx-auto max-w-6xl">
        <section className="flex flex-col justify-between gap-6 pb-10 pt-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-200/70">
              Your letters
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Messages you&apos;ve sent
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
              Every letter you create while signed in appears here, ready to open,
              copy, or share again.
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex rounded-2xl bg-white px-6 py-4 text-sm font-bold text-zinc-950 transition hover:bg-rose-50"
          >
            Write another
          </Link>
        </section>

        {letters.length === 0 ? (
          <section className="rounded-3xl border border-white/12 bg-white/[0.045] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold">No sent letters yet</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/64">
              Choose an occasion, generate your first letter, and it will show up here.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {letters.map((letter) => (
              <Link
                key={letter.slug}
                href={`/l/${letter.slug}`}
                className="group rounded-3xl border border-white/12 bg-white/[0.045] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-1 hover:border-white/24 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-rose-200/15 bg-rose-100/10 px-3 py-1 text-xs font-bold capitalize text-rose-100/80">
                    {String(letter.occasion || "letter").replaceAll("-", " ")}
                  </span>
                  <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70">
                    →
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-white">{letter.title}</h2>
                <p className="mt-4 text-sm leading-6 text-white/64">{letter.preview}</p>
                <p className="mt-6 text-xs text-white/45">
                  To {letter.recipient_name || "recipient"}
                </p>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
