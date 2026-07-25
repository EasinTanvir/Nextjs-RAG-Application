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

      console.log("response.embeddings", response.embeddings[0].values);
      const values = response.embeddings[0].values;
      return values;
    }),
  );

  console.log(
    `Sent ${inputs.length} texts, got ${embeddings.length} embeddings`,
  );

  // Returns array of arrays matching ChromaDB format: [[...512 floats...], [...512 floats...]]
  return embeddings;
}
