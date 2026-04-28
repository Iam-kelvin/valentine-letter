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
    <section id="samples" className="border-y border-[#7c3f3f]/10 bg-[#f1dec7] px-5 py-16 text-[#2b1616] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-900/55">
            Examples
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#2b1616] sm:text-4xl">
            Messages that sound like you meant every word.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {samples.map((sample) => (
            <article
              key={sample.title}
              className="rounded-3xl border border-[#7c3f3f]/15 bg-[#fff7ed]/70 p-7 shadow-[0_28px_90px_rgba(43,22,22,0.14)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:bg-[#fffaf3]"
            >
              <span className="rounded-full border border-rose-900/10 bg-rose-900/[0.06] px-3 py-1 text-xs font-semibold text-rose-950/70">
                {sample.tag}
              </span>
              <h3 className="mt-7 text-xl font-semibold text-[#2b1616]">{sample.title}</h3>
              <p className="mt-5 text-lg leading-8 text-[#5e3830]">&ldquo;{sample.text}&rdquo;</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
