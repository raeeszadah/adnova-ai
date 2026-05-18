import { GoogleGenerativeAI } from "@google/generative-ai";

const SCRIPT_PROMPT = (title: string, description: string) =>
  `Write a short, engaging 15-second video advertisement script for a product named "${title}".
The product description is: "${description}".
Format the script with three distinct sections labeled Hook, Benefits, and CTA. Keep lines short for on-screen subtitles.`;

export type ScriptProvider = "GEMINI" | "OPENROUTER" | "MOCK";

function mockScript(title: string, description: string) {
  return `Hook: Stop scrolling! Have you seen the amazing ${title}?

Benefits: ${description}

CTA: Tap the link and get yours today before they sell out!`;
}

export async function generateAdScript(
  title: string,
  description: string
): Promise<{ script: string; provider: ScriptProvider }> {
  const prompt = SCRIPT_PROMPT(title, description);

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey !== "placeholder") {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text()?.trim();
      if (text) {
        return { script: text, provider: "GEMINI" };
      }
    } catch (e) {
      console.warn("Gemini script failed, trying fallback:", e);
    }
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey && openRouterKey !== "placeholder") {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
          "X-Title": "AdNova AI",
        },
        body: JSON.stringify({
          model:
            process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-001",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const script = data.choices?.[0]?.message?.content?.trim();
        if (script) {
          return { script, provider: "OPENROUTER" };
        }
      } else {
        console.warn("OpenRouter script failed:", res.status, await res.text());
      }
    } catch (e) {
      console.warn("OpenRouter request error:", e);
    }
  }

  return { script: mockScript(title, description), provider: "MOCK" };
}
