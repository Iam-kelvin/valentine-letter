import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLettersForUser, getReceivedLettersForUser } from "@/lib/db";

type LetterRow = {
  slug: string;
  occasion?: string | null;
  title?: string | null;
  preview?: string | null;
  sender_name?: string | null;
  recipient_name?: string | null;
  quality_tier?: string | null;
  is_premium?: boolean | null;
};

export default async function LettersDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [writtenLetters, receivedLetters] = await Promise.all([
    getLettersForUser(userId),
    getReceivedLettersForUser(userId),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#250712] px-5 py-8 text-white sm:px-8 lg:px-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(251,113,133,0.22),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(251,191,36,0.11),transparent_26%),radial-gradient(circle_at_50%_110%,rgba(168,85,247,0.10),transparent_34%),linear-gradient(180deg,#3a0d1a_0%,#210711_42%,#110508_100%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-white/[0.055] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <section className="grid gap-8 pb-10 pt-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-200/70">
              Your letters
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Written and received letters
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Letters you create stay under Written. Letters opened while signed in
              from someone else stay under Received.
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex w-full justify-center rounded-2xl bg-white px-6 py-4 text-sm font-bold text-zinc-950 shadow-[0_24px_80px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-rose-50 sm:w-auto"
          >
            Write another
          </Link>
        </section>

        <LettersSection
          title="Written by you"
          emptyTitle="No written letters yet"
          emptyBody="Choose an occasion, generate your first letter, and it will show up here."
          letters={writtenLetters as LetterRow[]}
          footerLabel={(letter) => `To ${letter.recipient_name || "recipient"}`}
        />

        <div className="mt-10">
          <LettersSection
            title="Received by you"
            emptyTitle="No received letters yet"
            emptyBody="When you open a shared Letterly link while signed in, it will appear here."
            letters={receivedLetters as LetterRow[]}
            footerLabel={(letter) => `From ${letter.sender_name || "someone"}`}
          />
        </div>
      </div>
    </main>
  );
}

function LettersSection({
  title,
  emptyTitle,
  emptyBody,
  letters,
  footerLabel,
}: {
  title: string;
  emptyTitle: string;
  emptyBody: string;
  letters: LetterRow[];
  footerLabel: (letter: LetterRow) => string;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/52">
          {letters.length}
        </span>
      </div>

      {letters.length === 0 ? (
        <section className="rounded-3xl border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.035))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur">
          <h3 className="text-2xl font-semibold">{emptyTitle}</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/64">{emptyBody}</p>
          <Link
            href="/create"
            className="mt-6 inline-flex rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.10]"
          >
            Choose an occasion {"\u2192"}
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {letters.map((letter) => {
            const letterIsPremium =
              letter.is_premium === true ||
              letter.quality_tier === "premium" ||
              letter.quality_tier === "signature";

            return (
              <Link
                key={letter.slug}
                href={`/l/${letter.slug}`}
                className="group min-w-0 rounded-3xl border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.035))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-rose-100/30 hover:bg-white/[0.10]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-rose-200/15 bg-rose-100/10 px-3 py-1 text-xs font-bold capitalize text-rose-100/85">
                      {String(letter.occasion || "letter").replaceAll("-", " ")}
                    </span>
                    {letterIsPremium ? (
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black text-rose-100">
                        Signature
                      </span>
                    ) : null}
                  </div>
                  <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70">
                    {"\u2192"}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold leading-tight text-white">
                  {letter.title || "Untitled letter"}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/64">{letter.preview}</p>
                <p className="mt-6 text-xs text-white/45">{footerLabel(letter)}</p>
              </Link>
            );
          })}
        </section>
      )}
    </section>
  );
}
