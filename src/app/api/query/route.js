import { NextResponse } from "next/server";

import { getCollection } from "@/lib/chroma";
import { genAiEmbedding } from "@/lib/genAiEmbedding";
import llm from "@/lib/llm";

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Query is required.",
        },
        { status: 400 },
      );
    }

    // Generate query embedding
    const [queryEmbedding] = await genAiEmbedding(query);

    // Search Chroma
    const collection = await getCollection();

    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5,
    });

    const retrievedChunks = results.documents?.[0] ?? [];

    if (retrievedChunks.length === 0) {
      return NextResponse.json({
        success: true,
        answer:
          "I couldn't find any relevant information in the uploaded documents.",
        sources: [],
      });
    }

    // Build Context
    const context = retrievedChunks.join("\n\n---\n\n");

    // Prompt
    const prompt = `
You are a helpful AI assistant.

Answer the user's question ONLY using the provided context.

If the answer cannot be found in the context, reply exactly:

"I couldn't find that information in the uploaded documents."

Context:
${context}

Question:
${query}

Answer:
`;

    // Generate Answer
    const response = await llm.invoke(prompt);

    return NextResponse.json({
      success: true,
      answer: response.content,
      sources: results.metadatas?.[0] ?? [],
    });
  } catch (error) {
    console.error("❌ Query Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
