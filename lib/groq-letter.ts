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

function getMothersDayRecipientMode(recipientType?: string | null) {
  const value = (recipientType || "").trim().toLowerCase();

  if (
    value === "my mother" ||
    value === "my wife" ||
    value === "expecting mother" ||
    value === "single mother" ||
    value === "grandmother" ||
    value === "my aunt" ||
    value === "my sister" ||
    value === "my mother-in-law" ||
    value === "church mother"
  ) {
    return "confirmed_mother";
  }

  if (value === "mother figure") {
    return "mother_figure";
  }

  if (
    value === "girlfriend" ||
    value === "future mother" ||
    value === "a woman who will make a great mother"
  ) {
    return "future_or_not_yet_mother";
  }

  return "generic";
}

function buildOccasionRules(occasion: string, recipientType?: string) {
  switch (occasion) {
    case "mothers-day": {
      const mode = getMothersDayRecipientMode(recipientType);

      return `
Write a Mother's Day letter.
The message should feel warm, grateful, honoring, affectionate, and respectful.

IMPORTANT:
Do NOT assume the recipient is already a mother.

Recipient mode: ${mode}

Rules:
- If confirmed_mother → you may speak of her as a mother.
- If mother_figure → focus on care, guidance, influence. Do NOT assume biological motherhood.
- If future_or_not_yet_mother → STRICTLY:
  - Do NOT say she is already a mother.
  - Do NOT describe her as a mother in any present sense.
  - Do NOT use phrases like:
    - "the mother you are"
    - "amazing mother"
    - "loving mother"
    - "your motherhood"
    - "as a mother"
  - Do NOT mention children or pregnancy.
  - You may admire her warmth, tenderness, nurturing spirit, emotional presence, and loving nature.
  - If you mention future motherhood potential, do it lightly and no more than once.
- If generic → stay warm but neutral.

Never invent:
- children
- pregnancy
- motherhood status

The letter must still feel fitting for Mother's Day even when the recipient is not already a mother.
End with a natural Mother's Day style closing.
`;
    }

    case "birthday":
      return `
Write a birthday letter.
Make it warm, celebratory, personal, and joyful.
End with a birthday-style closing.
`;

    case "fathers-day":
      return `
Write a Father's Day letter.
Make it warm, grounded, appreciative, and natural.
Keep it sincere without becoming overly poetic, flowery, or ceremonial.
Focus on presence, effort, steadiness, sacrifice, guidance, protection, humor, and showing up.
Do not invent children, fatherhood status, or family history that was not provided.
End with a natural Father's Day style closing.
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

    case "cheeky":
      return `
Write a cheeky letter.
Make it playful, bold, flirty, teasing, and emotionally believable.
Keep it PG-13 only.
No explicit sexual content, explicit anatomy, graphic descriptions, coercion, pressure, or vulgarity.
The flirtation should feel confident and tasteful, not crude.
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

function buildMothersDayTitlePreviewRules(recipientType?: string | null) {
  const mode = getMothersDayRecipientMode(recipientType);

  if (mode === "confirmed_mother") {
    return `
Title and preview rules:
- Title may directly reference motherhood naturally.
- Preview may honor her as a mother.
- Avoid sounding generic or cliché.
`;
  }

  if (mode === "mother_figure") {
    return `
Title and preview rules:
- Do not assume biological motherhood.
- Title should feel respectful, warm, and personal.
- Preview should focus on care, guidance, love, wisdom, influence, or presence.
- Avoid phrases like "the amazing mother you are" unless explicitly established.
`;
  }

  if (mode === "future_or_not_yet_mother") {
    return `
Title and preview rules:
- Do NOT present the recipient as already being a mother.
- The title and preview MUST NOT describe the recipient as a mother in the present.
- Do NOT mention pregnancy, children, or motherhood as a current fact.
- Title should still feel fitting for Mother's Day, but gentle and emotionally intelligent.
- Prefer titles like:
  - "A Tender Mother's Day Note for [Name]"
  - "A Heartfelt Message for [Name] This Mother's Day"
  - "A Soft Letter for Someone Special on Mother's Day"
- Preview should focus on warmth, nurturing spirit, admiration, tenderness, character, and emotional presence.
- Avoid previews like:
  - "for the amazing mother you are"
  - "to a loving mother"
  - "celebrating your motherhood"
`;
  }

  return `
Title and preview rules:
- Keep title and preview warm, respectful, and natural.
- Avoid making strong assumptions about motherhood status.
`;
}

function buildHumanToneRules(input: any) {
  const recipientMode =
    input.occasion === "mothers-day"
      ? getMothersDayRecipientMode(input.recipientType)
      : "generic";

  const extraGirlfriendRule =
    input.occasion === "mothers-day" &&
    recipientMode === "future_or_not_yet_mother" &&
    String(input.recipientType || "").trim().toLowerCase() === "girlfriend"
      ? `
For this Mother's Day letter to a girlfriend:
- Make it emotionally rich without sounding like a prophecy.
- Do NOT overuse phrases like "you will be a great mother someday."
- At most, lightly imply nurturing qualities once if it fits naturally.
- Focus more on her heart, warmth, softness, strength, care, emotional presence, and the way she loves.
- Keep it romantic, grounded, and sincere.
`
      : "";

  const cheekyRule =
    input.occasion === "cheeky"
      ? `
For this cheeky letter:
- Keep the confidence playful, not pushy.
- Build tension with wit, implication, and charm.
- Do not include explicit sexual content or graphic language.
- Keep every line safe to send as a PG-13 flirtatious message.
`
      : "";

  return `
Human tone rules:
- Write like a real person, not like a greeting card generator.
- Avoid stacked abstract compliments like "your love, strength, grace, and beauty."
- Avoid clichés unless used very sparingly.
- Vary sentence length.
- Include some natural phrasing that feels spoken and intimate.
- Let the emotion feel grounded, not overdramatic.
- Be specific when details are provided.
- Do not sound overly polished, robotic, or ceremonial.
- Avoid repeating the same emotional words too often.
${extraGirlfriendRule}
${cheekyRule}
`;
}

function buildQualityTierRules(input: any) {
  const tier = input.qualityTier === "premium" ? "premium" : "standard";

  if (tier === "premium") {
    return `
Quality tier: premium

Premium writing rules:
- The writing should feel deeply personal, natural, and emotionally believable.
- Use more nuanced emotional pacing.
- Vary sentence rhythm more intentionally.
- Avoid generic greeting-card phrasing.
- Avoid sounding overly polished or formulaic.
- Let some lines feel intimate, lived-in, and slightly imperfect in a human way.
- Use specific, grounded emotional observations when details are available.
- Open with a stronger emotional hook.
- End with a more memorable and moving closing.
- Make the preview feel sharper, more elegant, and less generic.
- The title should feel specific and emotionally appealing, not templated.
`;
  }

  return `
Quality tier: standard

Standard writing rules:
- Keep the writing warm, clear, natural, and emotionally pleasant.
- Avoid obvious clichés where possible.
- Keep the structure simple and readable.
- Make the title and preview clear and appropriate.
`;
}

function buildLanguageRules(input: any) {
  const mode = input.languageMode || "english";
  const nativeLanguage = String(input.nativeLanguage || "").trim();

  if (mode === "bilingual" && nativeLanguage) {
    return `
Language mode: bilingual
- Write mainly in English.
- Blend in a small, natural amount of ${nativeLanguage}.
- Do not overdo it.
- Keep the letter readable for someone who understands mostly English.
- Use the second language for emotional emphasis, closings, or selected lines only.
- Do not make it feel like a stiff translation exercise.
`;
  }

  if (mode === "native" && nativeLanguage) {
    return `
Language mode: native
- Write the letter primarily in ${nativeLanguage}.
- Keep it emotionally natural and culturally believable.
- Avoid literal, awkward, textbook-style phrasing.
- If needed, preserve names and certain relationship words naturally.
`;
  }

  return `
Language mode: english
- Write naturally in English.
`;
}

function getEffectiveLength(input: any) {
  const requested = input.length || "medium";
  const tier = input.qualityTier === "premium" ? "premium" : "standard";

  if (tier === "premium") {
    if (requested === "short") return { min: 180, max: 260 };
    if (requested === "medium") return { min: 320, max: 460 };
    return { min: 520, max: 760 };
  }

  return lengthRanges[requested] ?? lengthRanges.medium;
}

function buildClosingRule(occasion: string) {
  if (occasion === "mothers-day") {
    return `Use a fitting Mother's Day closing naturally. Examples include: "Happy Mother's Day 💐", "With love always", "With all my love", "Forever grateful". Only use relationship-specific closings like "Your proud child" if they clearly fit the sender role.`;
  }
  if (occasion === "fathers-day") {
    return `Use a fitting Father's Day closing naturally, warm and appreciative without becoming overly poetic.`;
  }
  if (occasion === "birthday") {
    return `Use a birthday-themed closing naturally.`;
  }
  if (occasion === "cheeky") {
    return `Use a playful, flirty closing naturally while staying PG-13.`;
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
  const { min, max } = getEffectiveLength(input);

  const titlePreviewRules =
    input.occasion === "mothers-day"
      ? buildMothersDayTitlePreviewRules(input.recipientType)
      : `
Title and preview rules:
- Make both feel natural, specific, and emotionally believable.
- Avoid generic greeting-card phrasing.
- Do not use placeholder language.
- Make the title feel like something a real person would want to send.
- Make the preview feel inviting and emotionally grounded.
`;

  return `
${buildOccasionRules(input.occasion, input.recipientType)}
${titlePreviewRules}
${buildHumanToneRules(input)}
${buildQualityTierRules(input)}
${buildLanguageRules(input)}

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
  const { min, max } = getEffectiveLength(input);
  const wc = wordCount(out1.letter);

  const recipientMode =
    input.occasion === "mothers-day"
      ? getMothersDayRecipientMode(input.recipientType)
      : "generic";

  const invalidMotherAssumption =
    input.occasion === "mothers-day" &&
    recipientMode === "future_or_not_yet_mother" &&
    /(mother you are|amazing mother|loving mother|incredible mother|beautiful mother|your motherhood|as a mother|the mother that you are|your children|our children|pregnan|happy mother'?s day)/i.test(
      `${out1.title}\n${out1.preview}\n${out1.letter}\n${out1.ps || ""}`
    );

  const needsLengthFix = wc < min || wc > max;

  const needsPremiumPolish =
    input.qualityTier === "premium" &&
    /your love, strength, grace, and beauty|truly special gift|constant source of comfort, strength, and joy|filled with so much gratitude/i.test(
      `${out1.title}\n${out1.preview}\n${out1.letter}\n${out1.ps || ""}`
    );

  if (!needsLengthFix && !invalidMotherAssumption && !needsPremiumPolish) {
    return out1;
  }

  let extraFix = `Rewrite letter to ${min}-${max} words. Keep tone and details. JSON only.`;

  if (invalidMotherAssumption) {
    extraFix = `Rewrite so it does NOT assume the recipient is already a mother.
Do NOT use "Happy Mother's Day" directly.
Do NOT frame the message as celebrating her as a mother.
Do NOT mention children or pregnancy.
Keep it emotionally rich, natural, and suitable for Mother's Day in a soft, indirect way.
JSON only.`;
  } else if (needsPremiumPolish) {
    extraFix = `Rewrite to feel more human and less like a greeting card.
Reduce clichés and generic praise.
Vary sentence rhythm more.
Make the writing feel more intimate, grounded, and natural.
Keep the same meaning and emotional tone.
Return JSON only.`;
  }

  return await callGroq(input, extraFix);
}
