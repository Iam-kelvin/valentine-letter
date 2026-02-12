import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const OutputSchema = z.object({
  title: z.string().min(1).max(80),
  preview: z.string().min(1).max(140),
  letter: z.string().min(60).max(5000),
  ps: z.string().max(180).optional().default("")
});

function buildPrompt(input: any) {
  const list = (label: string, arr?: string[]) =>
    arr?.length ? `${label}:\n${arr.map((x) => `- ${x}`).join("\n")}\n` : "";

  const spicyRule =
    input.tone === "spicy_pg13"
      ? `Keep it flirty/suggestive but PG-13 only. No explicit sex words/anatomy.\n`
      : "";

  return `
Write a Valentine letter.

Return ONLY valid JSON with keys:
"title", "preview", "letter", "ps"

Rules:
- Use senderName and recipientName exactly.
- No placeholders like [name].
- No mention of AI/policies.
- No manipulation, threats, insults.
- Max 2 emojis.
${spicyRule}

Inputs:
senderName: ${input.senderName}
recipientName: ${input.recipientName}
relationshipType: ${input.relationshipType}
tone: ${input.tone}
length: ${input.length}
privateDetailLevel: ${input.privateDetailLevel}

${list("memories", input.memories)}
${list("insideJokes", input.insideJokes)}
${list("qualities", input.qualities)}
${list("futurePlans", input.futurePlans)}
${input.callToAction ? `callToAction: ${input.callToAction}\n` : ""}

Letter MUST end with:
— ${input.senderName}
`.trim();
}

export async function generateLetterWithGroq(input: any) {
  const resp = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    messages: [{ role: "user", content: buildPrompt(input) }],
    response_format: { type: "json_object" } as any
  });

  const text = resp.choices[0]?.message?.content ?? "";
  const parsed = OutputSchema.parse(JSON.parse(text));
  return {
    title: parsed.title,
    preview: parsed.preview,
    letter: parsed.letter,
    ps: parsed.ps ?? ""
  };
}