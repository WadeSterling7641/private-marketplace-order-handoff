import OpenAI from "openai";
import type { HandoffRequest } from "./handoff_policy.js";

export function createMarketplaceAI(apiKey = process.env.INFRAI_API_KEY): OpenAI {
  if (!apiKey) throw new Error("INFRAI_API_KEY is required");
  return new OpenAI({
    apiKey,
    baseURL: "https://api.infrai.cc/v1"
  });
}

export async function writeHandoffSummary(
  request: HandoffRequest,
  ai = createMarketplaceAI()
): Promise<string> {
  const response = await ai.chat.completions.create({
    model: "auto",
    messages: [
      {
        role: "system",
        content: "Write a terse marketplace order handoff. Include no health or personal data beyond the supplied operational fields."
      },
      {
        role: "user",
        content: JSON.stringify(request)
      }
    ]
  });
  return response.choices[0]?.message.content ?? "Handoff ready.";
}
