const reasons = [
  {
    title: "Feels personal",
    text: "Messages that feel more thoughtful, specific, and natural.",
  },
  {
    title: "Ready in seconds",
    text: "You do not need to struggle for the right words from scratch.",
  },
  {
    title: "Beautiful enough to send",
    text: "Made to feel special whether you send it, save it, or share it.",
  },
];

export function WhyLetterly() {
  return (
    <section className="px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Why Letterly</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className="rounded-3xl border border-white/10 bg-black/25 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
            >
              <h3 className="text-xl font-semibold text-white">{reason.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/65">{reason.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
