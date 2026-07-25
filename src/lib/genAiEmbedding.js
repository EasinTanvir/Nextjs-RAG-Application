import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function genAiEmbedding(texts) {
  const inputs = Array.isArray(texts) ? texts : [texts];

  const embeddings = await Promise.all(
    inputs.map(async (text) => {
      const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
        config: {
          outputDimensionality: 512,
        },
      });

      return response.embeddings[0].values;
    }),
  );

  return embeddings;
}
