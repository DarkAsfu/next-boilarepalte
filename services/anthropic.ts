import Anthropic from "@anthropic-ai/sdk";

type AnalysisResult = { caption: string; tags: string[] };

function parseResult(text: string): AnalysisResult {
  const parsed: unknown = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") throw new Error("Anthropic returned invalid JSON");
  const value = parsed as Record<string, unknown>;
  if (
    typeof value.caption !== "string" ||
    !Array.isArray(value.tags) ||
    value.tags.length < 1 ||
    value.tags.length > 8 ||
    !value.tags.every((tag) => typeof tag === "string")
  ) {
    throw new Error("Anthropic returned an invalid caption or tag list");
  }
  return { caption: value.caption.trim(), tags: value.tags.map((tag) => tag.trim()) };
}

export async function analyzeImage(imageUrl: string): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.NEXT_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const fetchUrl = imageUrl.replace(/\/\d+\/\d+(?:\?.*)?$/, "/512/512");
  const imageResponse = await fetch(fetchUrl === imageUrl ? imageUrl : fetchUrl);
  if (!imageResponse.ok) throw new Error(`Image download failed with status ${imageResponse.status}`);
  const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
  const imageData = Buffer.from(await imageResponse.arrayBuffer()).toString("base64");
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? process.env.NEXT_ANTHROPIC_MODEL ?? "claude-haiku-5-5",
    max_tokens: 300,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: contentType as "image/jpeg", data: imageData } },
        { type: "text", text: 'Return only JSON with this shape: {"caption":"...","tags":["..."]}. Write one concise caption and 3-6 concrete visual tags.' },
      ],
    }],
  });
  const text = response.content.find((block) => block.type === "text")?.text;
  if (!text) throw new Error("Anthropic returned no text");
  return parseResult(text);
}