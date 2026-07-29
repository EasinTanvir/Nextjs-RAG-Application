import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function genAiEmbedding(texts) {
  const inputs = Array.isArray(texts) ? texts : [texts];

  const BATCH_SIZE = 50;
  const allEmbeddings = [];

  for (let i = 0; i < inputs.length; i += BATCH_SIZE) {
    const batch = inputs.slice(i, i + BATCH_SIZE);

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: batch,
      config: { outputDimensionality: 512 },
    });

    if (response.embeddings.length !== batch.length) {
      throw new Error(
        "miss",
        `Embedding count mismatch: sent ${batch.length}, got back ${response.embeddings.length}`,
      );
    }

    allEmbeddings.push(...response.embeddings.map((e) => e.values));
  }

  return allEmbeddings;
}
