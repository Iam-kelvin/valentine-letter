import { FinalCta } from "@/components/home/FinalCta";
import { HomeHero } from "@/components/home/HomeHero";
import { OccasionCards } from "@/components/home/OccasionCards";
import { SampleLetterShowcase } from "@/components/home/SampleLetterShowcase";
import { WhyLetterly } from "@/components/home/WhyLetterly";

export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden bg-[#050305] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.20),transparent_34%),radial-gradient(circle_at_12%_22%,rgba(190,18,60,0.13),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0)_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-white/20" />

      <HomeHero />
      <SampleLetterShowcase />
      <OccasionCards />
      <WhyLetterly />
      <FinalCta />
    </main>
  );
}
