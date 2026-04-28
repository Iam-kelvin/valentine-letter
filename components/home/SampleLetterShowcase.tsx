const samples = [
  {
    tag: "Love",
    title: "For someone you love",
    text: "There's something about the way you care that never feels forced. You make love feel safe, warm, and honest.",
  },
  {
    tag: "Mother's Day",
    title: "For Mother's Day",
    text: "I didn't understand how much you carried until I got older. Now I see your love in everything.",
  },
  {
    tag: "Cheeky",
    title: "For the messy ones 😏",
    text: "I probably shouldn't be saying this, but you've been on my mind more than I want to admit.",
  },
];

export function SampleLetterShowcase() {
  return (
    <section id="samples" className="px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-200/70">
            Examples
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Messages that sound like you meant every word.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {samples.map((sample) => (
            <article
              key={sample.title}
              className="rounded-3xl border border-white/12 bg-white/[0.055] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.075]"
            >
              <span className="rounded-full border border-rose-200/15 bg-rose-100/10 px-3 py-1 text-xs font-semibold text-rose-100/85">
                {sample.tag}
              </span>
              <h3 className="mt-7 text-xl font-semibold text-white">{sample.title}</h3>
              <p className="mt-5 text-lg leading-8 text-white/78">&ldquo;{sample.text}&rdquo;</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
