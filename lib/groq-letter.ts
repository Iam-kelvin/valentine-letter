// lib/groq-letter.ts
import Groq from "groq-sdk";
import { z } from "zod";

const OutputSchema = z.object({
  title: z.string().min(1).max(80),
  preview: z.string().min(1).max(140),
  letter: z.string().min(60).max(5000),
  ps: z.string().max(180).optional().default(""),
});

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY env var");
  }
  return new Groq({ apiKey });
}

export async function generateLetterWithGroq(input: {
  recipientName: string;
  relationship: string;
  tone: string;
  length: "Short" | "Medium" | "Long";
  detailLevel: string;
  memory: string;
  senderName: string;
}) {
  const groq = getGroqClient();

  const prompt = `
You are writing a Valentine's letter.

Recipient: ${input.recipientName}
Relationship: ${input.relationship}
Tone: ${input.tone}
Length: ${input.length}
Detail level: ${input.detailLevel}
Memory / Specific detail: ${input.memory}
From: ${input.senderName}

Return JSON ONLY with keys: title, preview, letter, ps.
`;

  const completion = await groq.chat.completions.create({
    // Use a supported Groq production model:
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    response_format: { type: "json_object" },
  });

  const text = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(text);
  return OutputSchema.parse(parsed);
}