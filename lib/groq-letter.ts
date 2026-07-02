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

type GeneratedLetter = z.infer<typeof OutputSchema>;
type QualityTier = "standard" | "premium";

const lengthRanges: Record<QualityTier, Record<string, { min: number; max: number }>> = {
  standard: {
    short: { min: 80, max: 140 },
    medium: { min: 180, max: 260 },
  },
  premium: {
    short: { min: 180, max: 260 },
    medium: { min: 320, max: 480 },
    long: { min: 520, max: 750 },
  },
};

function wordCount(s: string) {
  return (s.trim().match(/\S+/g) ?? []).length;
}

function cleanOneLine(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function clampText(value: unknown, max: number, fallback: string) {
  const clean = cleanOneLine(value) || fallback;
  if (clean.length <= max) return clean;

  const slice = clean.slice(0, max).trimEnd();
  const lastSpace = slice.lastIndexOf(" ");

  if (lastSpace > Math.floor(max * 0.6)) {
    return slice.slice(0, lastSpace).trimEnd();
  }

  return slice;
}

function normalizeGeneratedLetter(raw: unknown) {
  const value =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const letter = String(value.letter ?? "").trim();
  const title = clampText(value.title, 80, "A Letter From the Heart");
  const previewSource =
    cleanOneLine(value.preview) ||
    cleanOneLine(letter.split(/\n\s*\n/)[0]) ||
    "A personal letter written with care.";

  return {
    title,
    preview: clampText(previewSource, 140, "A personal letter written with care."),
    letter,
    ps: clampText(value.ps, 280, ""),
  };
}

function getQualityTier(input: { qualityTier?: unknown }): QualityTier {
  return input.qualityTier === "premium" || input.qualityTier === "signature"
    ? "premium"
    : "standard";
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

function buildOccasionRules(
  occasion: string,
  recipientType?: string,
  occasionDetails?: string | null
) {
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

    case "apology":
      return `
Write an apology letter.
Tone: sincere, accountable, emotionally honest.

Rules:
- DO NOT be defensive.
- DO NOT over-explain or turn the letter into a list of excuses.
- Acknowledge the mistake clearly and plainly.
- Express remorse without asking the recipient to comfort the sender.
- Show growth through specific ownership, not dramatic promises.
- No manipulation, guilt-tripping, pressure, or self-pity.

Structure:
- Open with direct accountability.
- Name the impact or hurt without minimizing it.
- Say what the sender is sorry for.
- Close with respect for the recipient's feelings and space.
`;

    case "congratulations": {
      const achievement = String(occasionDetails || "").trim();

      return `
Write a congratulations letter.
Tone: celebratory, uplifting.
${achievement ? `Specific achievement: "${achievement}"` : "Specific achievement: not provided. Use a neutral but still concrete phrase like \"this milestone you reached\" or \"the step you worked so hard to reach,\" and lean on any supplied details."}

Rules:
- If a specific achievement is provided, the letter MUST reference it naturally.
- Avoid generic phrases like "your achievement" without naming or describing the achievement.
- Avoid generic praise like "you are amazing" unless it is tied to something specific.
- Mention effort, journey, growth, persistence, struggle, courage, or sacrifice if relevant.
- Make the celebration feel earned and personal.
- Keep the energy bright without sounding like a formal award speech.

Structure:
- Start with the specific win or milestone.
- Reflect on the path that made it meaningful.
- Celebrate who they became in the process.
- End with pride, joy, and encouragement for what comes next.
`;
    }

    case "closure":
      return `
Write a closure letter.
Tone: calm, reflective, emotionally mature.

Rules:
- No begging.
- No blaming.
- Accept the ending clearly.
- Express gratitude where appropriate, without rewriting the past as perfect.
- Create a clean emotional ending.
- Do not use the letter to reopen the relationship or demand answers.

Structure:
- Begin from acceptance.
- Reflect briefly on what mattered.
- Release blame, pressure, and unfinished arguments.
- End with a peaceful goodbye.
`;

    case "situationship":
      return `
Write a situationship letter.
Tone: honest, slightly conflicted, modern.

Rules:
- Acknowledge the ambiguity directly.
- Avoid overly poetic language.
- Feel real, slightly messy, not perfect.
- Do not force certainty if the provided details are uncertain.
- Make the tension conversational, not theatrical.

Structure:
- Start with what has been hard to say plainly.
- Name the mixed signals, unclear labels, or emotional gray area.
- Say what the sender honestly feels or needs.
- End with a grounded, human note rather than a dramatic ultimatum.
`;

    case "confession":
      return `
Write a confession letter.
Tone: vulnerable, direct, emotionally risky.

Rules:
- Build tension gradually.
- Include a clear reveal moment where the feeling is finally named.
- Avoid cliches like "from the moment I saw you" unless the user provided that exact detail.
- Keep the vulnerability brave and specific, not melodramatic.
- Do not pressure the recipient to respond a certain way.

Structure:
- Begin with hesitation or the reason it has been hard to say.
- Let the emotion gather through concrete observations.
- Make one unmistakable confession.
- End with honesty and respect for whatever they feel.
`;

    case "miss-you":
      return `
Write a miss-you letter.
Tone: soft, emotional, simple.

Rules:
- Keep it relatively short even if a longer length is requested.
- Focus on absence, longing, and the feeling of missing them.
- Avoid over-explaining the relationship history.
- Use plain language and quiet emotion.
- Do not make the recipient feel guilty for being absent.

Structure:
- Open with the absence.
- Mention one or two specific things the sender misses.
- Let the feeling stay simple.
- Close gently.
`;

    case "thank-you":
      return `
Write a thank-you letter.
Tone: warm, grateful, grounded.

Rules:
- Include specific appreciation.
- Avoid generic gratitude phrases like "words cannot express" unless grounded in details.
- Name what the recipient did, gave, taught, or helped carry.
- Keep gratitude practical, personal, and sincere.

Structure:
- Start with the specific reason for thanks.
- Describe the impact it had on the sender.
- Appreciate the recipient's character through that action.
- End warmly without sounding formal.
`;

    case "friend":
      return `
Write a friendship letter.
Tone: casual, warm, authentic.

Rules:
- Less formal.
- More conversational.
- Include personality, humor, quirks, or familiar rhythm when details allow.
- Do not sound like a romantic love letter.
- Avoid ceremonial or overly polished language.

Structure:
- Open like someone texting or talking to a close friend.
- Include a specific shared memory, trait, or running joke if provided.
- Let affection feel easy and unforced.
- End with warmth, loyalty, or a casual promise to keep showing up.
`;

    case "faith":
      return `
Write a faith letter.
Tone: reflective, respectful, spiritual.

Rules:
- Prayer language is allowed when it fits the sender and recipient.
- Avoid sounding like a sermon.
- Keep it personal, not preachy.
- Do not lecture, shame, or imply the recipient lacks faith.
- Spiritual references should support the emotion, not replace it.

Structure:
- Begin with a personal reflection, concern, gratitude, or encouragement.
- Include prayer, blessing, scripture-like language, or faith language only if natural.
- Keep the focus on care and hope.
- End gently, with warmth and respect.
`;

    case "ex":
      return `
Write a letter to an ex.
Tone: emotional but controlled.

Rules:
- No desperation.
- No manipulation.
- It can express longing OR acceptance depending on the user's details.
- Do not beg for another chance unless the user explicitly asks, and even then keep it respectful.
- Do not blame the recipient or rewrite the breakup as one person's fault.

Structure:
- Start with a controlled emotional truth.
- Reflect on what remains, what changed, or what is being released.
- Keep longing restrained or acceptance clear.
- End without pressure.
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
  const tier = getQualityTier(input);

  if (tier === "premium") {
    return `
Quality tier: signature

Signature writing rules:
- Human is better than perfect. Do not make the writing overly poetic or dramatic.
- First paragraph must hook emotionally, feel personal, and avoid generic starts like "I just want to say" or "On this special day."
- Mix short and longer sentences; avoid overly symmetrical sentence patterns.
- Include at least one grounded emotional observation, such as a noticed habit, quiet effort, specific absence, or small human detail.
- Make the message fuller and more emotionally nuanced than standard, while staying believable.
- Strengthen the opening, closing, title, and preview.
- Use more personalization when details are provided.
- Avoid stacked adjectives like "love, strength, grace, beauty."
- Avoid repeating the same emotional words too often.
- Avoid generic greeting-card phrasing and obvious cliches, especially "truly special" and "from the bottom of my heart."
- Let some phrasing feel slightly imperfect, conversational, and human.
- Add subtle rhythm variation, emotional pauses, and human-like phrasing without becoming ornate.
- End with a personal, natural closing that is not generic, overly formal, or stiff.
- Avoid closings like "Yours sincerely" and avoid "With deepest gratitude" unless the occasion truly calls for formal gratitude.
- Make the preview sharper, more intimate, and less templated.
`;
  }

  return `
Quality tier: standard

Standard writing rules:
- Keep the writing simple, clean, emotionally clear, warm, and natural.
- Use short or medium pacing only.
- Make the result complete and good enough to send without any upgrade.
- Use recipientName, senderName, recipientType, tone, and occasionDetails when available.
- Include specific details when provided, but do not invent private facts.
- Avoid heavy poetic language.
- Avoid overly complex, ornate, or long phrasing.
- Keep sentence structure easy to read.
- Avoid obvious cliches where possible.
- Avoid sounding robotic, generic, or intentionally limited.
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
  const tier = getQualityTier(input);
  const ranges = lengthRanges[tier];

  if (tier === "standard") {
    return requested === "short" ? ranges.short : ranges.medium;
  }

  return ranges[requested] ?? ranges.medium;
}

function needsSignaturePolish(out: GeneratedLetter, occasion?: string) {
  const text = `${out.title}\n${out.preview}\n${out.letter}\n${out.ps || ""}`;
  const firstParagraph = out.letter.trim().split(/\n\s*\n/)[0] || out.letter.trim();
  const closingText = out.letter.slice(-500);
  const allowsFormalGratitude = occasion === "thank-you" || occasion === "appreciation";

  const clichePatterns = [
    /words cannot express/i,
    /from the bottom of my heart/i,
    /you mean the world to me/i,
    /more than words/i,
    /my heart is full/i,
    /grateful beyond words/i,
    /truly special/i,
    /constant source of comfort/i,
    /love,\s*strength,\s*grace,\s*(and\s*)?beauty/i,
    /beautiful soul/i,
    /light up my life/i,
  ];

  const genericPatterns = [
    /you are amazing/i,
    /you are so special/i,
    /you mean so much to me/i,
    /i am so lucky to have you/i,
    /thank you for everything/i,
    /i appreciate everything you do/i,
    /you have always been there for me/i,
    /i will always cherish/i,
  ];

  const genericOpeningPatterns = [
    /^\s*i just want(?:ed)? to say/i,
    /^\s*on this special day/i,
    /^\s*i am writing this letter/i,
    /^\s*i wanted to take a moment/i,
    /^\s*where do i even begin/i,
  ];

  const formalClosingPatterns = [
    /yours sincerely/i,
    /sincerely yours/i,
    /respectfully yours/i,
    ...(allowsFormalGratitude ? [] : [/with deepest gratitude/i]),
  ];

  const clicheScore = clichePatterns.filter((pattern) => pattern.test(text)).length;
  const genericScore = genericPatterns.filter((pattern) => pattern.test(text)).length;
  const hasGenericOpening = genericOpeningPatterns.some((pattern) => pattern.test(firstParagraph));
  const hasFormalClosing = formalClosingPatterns.some((pattern) => pattern.test(closingText));

  return clicheScore > 0 || genericScore >= 2 || hasGenericOpening || hasFormalClosing;
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
  if (occasion === "apology") {
    return `Close with accountability and respect for the recipient's feelings, without asking for instant forgiveness.`;
  }
  if (occasion === "closure") {
    return `Close with calm acceptance, release, and a clean goodbye.`;
  }
  if (occasion === "situationship") {
    return `Close with honest uncertainty or a grounded request for clarity, not a dramatic ultimatum.`;
  }
  if (occasion === "confession") {
    return `Close after the clear reveal with honesty and respect, without pressuring the recipient.`;
  }
  if (occasion === "miss-you") {
    return `Close softly and simply, centered on missing them.`;
  }
  if (occasion === "thank-you") {
    return `Close with specific gratitude and warmth, not a generic thank-you line.`;
  }
  if (occasion === "friend") {
    return `Close casually and warmly, like something a real friend would say.`;
  }
  if (occasion === "faith") {
    return `Close with a gentle prayer, blessing, or hopeful faith note without sounding preachy.`;
  }
  if (occasion === "ex") {
    return `Close without desperation, pressure, or emotional bargaining.`;
  }
  if (occasion === "congratulations") {
    return `Close with celebration, pride, and encouragement for what comes next.`;
  }
  return `Use a fitting emotional closing naturally.`;
}

function buildUserPrompt(input: any) {
  const lines: string[] = [];
  const add = (k: string, v: any) => v && lines.push(`${k}: "${String(v)}"`);
  const qualityTier = getQualityTier(input);
  const requestedLength = input.length || "medium";
  const effectiveLength =
    qualityTier === "standard" && requestedLength === "long" ? "medium" : requestedLength;

  add("occasion", input.occasion);
  add("senderName", input.senderName);
  add("recipientName", input.recipientName);
  add("senderRole", input.senderRole);
  add("recipientType", input.recipientType);
  add("tone", input.tone);
  add("length", effectiveLength);
  add("qualityTier", qualityTier);
  add("occasionDetails", input.occasionDetails);
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
- Title must be 80 characters or fewer.
- Preview must be 140 characters or fewer.
`;

  return `
${buildOccasionRules(input.occasion, input.recipientType, input.occasionDetails)}
${titlePreviewRules}
${buildHumanToneRules(input)}
${buildQualityTierRules(input)}
${buildLanguageRules(input)}

Constraints:
- Tone: ${input.tone || "natural"}
- Target word count for "letter": ${min}-${max}
- Keep "title" at 80 characters or fewer, "preview" at 140 characters or fewer, and "ps" at 280 characters or fewer
- Use at least 3 specific details if provided
- Let the occasion change the structure, pacing, and diction; do not reuse generic emotional wording across categories
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
  return OutputSchema.parse(normalizeGeneratedLetter(JSON.parse(text)));
}

export async function generateLetterWithGroq(input: any) {
  const out1 = await callGroq(input);
  const { min, max } = getEffectiveLength(input);
  const wc = wordCount(out1.letter);
  const qualityTier = getQualityTier(input);

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

  const needsSignatureRewrite = qualityTier === "premium" && needsSignaturePolish(out1, input.occasion);

  if (!needsLengthFix && !invalidMotherAssumption && !needsSignatureRewrite) {
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
  } else if (needsSignatureRewrite) {
    extraFix = `Make this feel more human, reduce cliches, improve emotional flow, vary sentence rhythm.
Rewrite the opening so it hooks emotionally and does not start with "I just want to say" or "On this special day."
Include at least one grounded emotional observation.
Remove stacked adjectives and phrases like "love, strength, grace, beauty", "truly special", and "from the bottom of my heart."
Make the closing personal, natural, and not overly formal.
Allow slight imperfection and conversational phrasing; avoid overly symmetrical sentences.
Keep the same meaning, occasion rules, names, and details.
Rewrite letter to ${min}-${max} words.
Return JSON only.`;
  }

  return await callGroq(input, extraFix);
}
