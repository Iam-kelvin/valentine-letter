import { FinalCta } from "@/components/home/FinalCta";
import { HomeHero } from "@/components/home/HomeHero";
import { OccasionCards } from "@/components/home/OccasionCards";
import { SampleLetterShowcase } from "@/components/home/SampleLetterShowcase";
import { WhyLetterly } from "@/components/home/WhyLetterly";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { getAnonymousMessageCountForUser, getAnonymousProfileByUserId } from "@/lib/anonymous-db";
import { getRecentLettersForUser } from "@/lib/db";

export default async function HomePage() {
  const { userId } = await auth();
  const h = await headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";

  let recentLetters: Array<{
    slug: string;
    occasion: string;
    title: string;
    preview: string;
  }> = [];
  let inboxCount = 0;
  let anonymousLink: string | null = null;

  if (userId) {
    const [letters, profile, count] = await Promise.all([
      getRecentLettersForUser(userId, 3),
      getAnonymousProfileByUserId(userId),
      getAnonymousMessageCountForUser(userId),
    ]);

    recentLetters = letters.map((letter) => ({
      slug: String(letter.slug),
      occasion: String(letter.occasion || "letter"),
      title: String(letter.title || "Untitled letter"),
      preview: String(letter.preview || ""),
    }));
    inboxCount = Number(count || 0);
    anonymousLink = profile && host ? `${proto}://${host}/u/${profile.username}` : null;
  }

  return (
    <main className="relative isolate overflow-hidden bg-[#050305] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_6%,rgba(251,113,133,0.22),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(168,85,247,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0)_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-white/20" />

      <HomeHero
        isSignedIn={!!userId}
        recentLetters={recentLetters}
        inboxCount={inboxCount}
        anonymousLink={anonymousLink}
      />
      <WhyLetterly />
      <SampleLetterShowcase />
      <OccasionCards />
      <FinalCta />
    </main>
  );
}
