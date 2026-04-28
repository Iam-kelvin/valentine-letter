import Link from "next/link";

const occasions = [
  {
    title: "Love",
    emoji: "❤️",
    description: "Sweet, romantic, soft, playful, or deeply emotional.",
    href: "/create/love",
  },
  {
    title: "Mother's Day",
    emoji: "🌸",
    description: "For mothers, mother figures, and women worth honoring.",
    href: "/create/mothers-day",
  },
  {
    title: "Father's Day",
    emoji: "🧔🏾‍♂️",
    description: "For fathers, father figures, and the men who showed up.",
    href: "/create/fathers-day",
  },
  {
    title: "Women's Day",
    emoji: "🌷",
    description: "Celebrate her strength, presence, beauty, and impact.",
    href: "/create/womens-day",
  },
  {
    title: "Birthday",
    emoji: "🎂",
    description: "Make their day personal, warm, joyful, and unforgettable.",
    href: "/create/birthday",
  },
  {
    title: "Appreciation",
    emoji: "🙏",
    description: "Say thank you in a way they'll actually remember.",
    href: "/create/appreciation",
  },
  {
    title: "Just Because",
    emoji: "💌",
    description: "No holiday needed. Just say what's on your heart.",
    href: "/create/just-because",
  },
  {
    title: "Cheeky",
    emoji: "😏",
    description: "Playful, bold, flirty, and a little risky.",
    href: "/create/cheeky",
  },
  {
    title: "Anonymous",
    emoji: "👀",
    description: "Create a private link and read anonymous messages in your inbox.",
    href: "/anonymous",
  },
];

export function OccasionCards() {
  return (
    <section id="occasions" className="px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Made for every kind of message
        </h2>

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
