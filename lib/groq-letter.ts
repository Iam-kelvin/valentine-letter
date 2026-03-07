// import OpenAI from "openai";
// import { z } from "zod";

// const client = new OpenAI({
//   apiKey: process.env.GROQ_API_KEY!,
//   baseURL: "https://api.groq.com/openai/v1"
// });

// const OutputSchema = z.object({
//   title: z.string().min(1).max(80),
//   preview: z.string().min(1).max(140),
//   letter: z.string().min(60).max(5000),
//   ps: z.string().max(500).optional().default("")
// });

// function buildPrompt(input: any) {
//   const list = (label: string, arr?: string[]) =>
//     arr?.length ? `${label}:\n${arr.map((x) => `- ${x}`).join("\n")}\n` : "";

//   const spicyRule =
//     input.tone === "spicy_pg13"
//       ? `Keep it flirty/suggestive but PG-13 only. No explicit sex words/anatomy.\n`
//       : "";

//   return `
// Write a Valentine letter.

// Return ONLY valid JSON with keys:
// "title", "preview", "letter", "ps"

// Rules:
// - Use senderName and recipientName exactly.
// - No placeholders like [name].
// - No mention of AI/policies.
// - No manipulation, threats, insults.
// - Max 2 emojis.
// ${spicyRule}

// Inputs:
// senderName: ${input.senderName}
// recipientName: ${input.recipientName}
// relationshipType: ${input.relationshipType}
// tone: ${input.tone}
// length: ${input.length}
// privateDetailLevel: ${input.privateDetailLevel}

// ${list("memories", input.memories)}
// ${list("insideJokes", input.insideJokes)}
// ${list("qualities", input.qualities)}
// ${list("futurePlans", input.futurePlans)}
// ${input.callToAction ? `callToAction: ${input.callToAction}\n` : ""}

// Letter MUST end with:
// — ${input.senderName}
// `.trim();
// }

// export async function generateLetterWithGroq(input: any) {
//   const resp = await client.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     temperature: 0.7,
//     messages: [{ role: "user", content: buildPrompt(input) }],
//     response_format: { type: "json_object" } as any
//   });

//   const text = resp.choices[0]?.message?.content ?? "";
//   const parsed = OutputSchema.parse(JSON.parse(text));
//   return {
//     title: parsed.title,
//     preview: parsed.preview,
//     letter: parsed.letter,
//     ps: parsed.ps ?? ""
//   };
// }

import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const OutputSchema = z.object({
  title: z.string().min(1).max(80),
  preview: z.string().min(1).max(140),
  letter: z.string().min(60).max(5000),
  ps: z.string().max(280),
});

const lengthRanges: Record<string, { min: number; max: number }> = {
  short: { min: 120, max: 180 },
  medium: { min: 220, max: 320 },
  long: { min: 380, max: 520 },
};

function wordCount(s: string) {
  return (s.trim().match(/\S+/g) ?? []).length;
}

function buildOccasionRules(occasion: string) {
  switch (occasion) {
    case "mothers-day":
      return `
Write a Mother's Day letter.
The message should feel warm, grateful, honoring, affectionate, and respectful.
If senderRole and recipientType are provided, make the relationship dynamics feel natural.
Use Mother's Day language and end with a Mother's Day closing.
`;
    case "birthday":
      return `
Write a birthday letter.
Make it warm, celebratory, personal, and joyful.
End with a birthday-style closing.
`;
    case "appreciation":
      return `
Write an appreciation letter.
Make it sincere, grateful, and natural.
`;
    case "just-because":
      return `
Write a thoughtful just-because letter.
Make it emotionally real and unforced.
`;
    case "love":
    default:
      return `
Write a romantic love letter.
Keep it sweet, emotionally rich, and personal.
If spicy is requested, keep it PG-13 only.
`;
  }
}

function buildClosingRule(occasion: string) {
  if (occasion === "mothers-day") {
    return `Use one of these closing styles naturally: "Happy Mother's Day 💐", "With love always", "Forever grateful", "Your proud child".`;
  }
  if (occasion === "birthday") {
    return `Use a birthday-themed closing naturally.`;
  }
  return `Use a fitting emotional closing naturally.`;
}

function buildUserPrompt(input: any) {
  const lines: string[] = [];
  const add = (k: string, v: any) => v && lines.push(`${k}: "${String(v)}"`);

  add("occasion", input.occasion);
  add("senderName", input.senderName);
  add("recipientName", input.recipientName);
  add("senderRole", input.senderRole);
  add("recipientType", input.recipientType);
  add("tone", input.tone);
  add("length", input.length);
  add("privateDetailLevel", input.privateDetailLevel);
  add("callToAction", input.callToAction);

  if (input.extraEmotional) {
    lines.push(`Extra instruction: Make it especially tender, emotional, and memorable without sounding fake or overdramatic.`);
  }

  const bullets = (label: string, arr?: string[]) => {
    if (!arr?.length) return;
    lines.push(`${label}:`);
    arr.map((x) => String(x).trim()).filter(Boolean).forEach((x) => lines.push(`- "${x}"`));
  };

  bullets("memories", input.memories);
  bullets("insideJokes", input.insideJokes);
  bullets("qualities", input.qualities);
  bullets("futurePlans", input.futurePlans);

  lines.push(`Return JSON ONLY with keys: title, preview, letter, ps.`);
  return lines.join("\n");
}

function styleGuide(input: any) {
  const { min, max } = lengthRanges[input.length] ?? lengthRanges.medium;

  return `
${buildOccasionRules(input.occasion)}

Constraints:
- Tone: ${input.tone || "natural"}
- Target word count for "letter": ${min}-${max}
- Use at least 3 specific details if provided
- privateDetailLevel=${input.privateDetailLevel}
- ${buildClosingRule(input.occasion)}
- Keep names exactly as provided
- No placeholder text
- Return valid JSON only
`.trim();
}

async function callGroq(input: any, fix?: string) {
  const prompt = [styleGuide(input), buildUserPrompt(input), fix ? `FIX:\n${fix}` : ""]
    .filter(Boolean)
    .join("\n\n");

  const resp = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" } as any,
  });

  const text = resp.choices[0]?.message?.content ?? "";
  return OutputSchema.parse(JSON.parse(text));
}

export async function generateLetterWithGroq(input: any) {
  const out1 = await callGroq(input);
  const { min, max } = lengthRanges[input.length] ?? lengthRanges.medium;
  const wc = wordCount(out1.letter);
  if (wc >= min && wc <= max) return out1;
  return await callGroq(input, `Rewrite letter to ${min}-${max} words. Keep tone and details. JSON only.`);
}