import { NextResponse } from "next/server";

import { getCollection } from "@/lib/chroma";
import { genAiEmbedding } from "@/lib/genAiEmbedding";
import llm from "@/lib/llm";
import { getSessionId } from "@/lib/session";

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Query is required.",
        },
        {
          status: 400,
        },
      );
    }

    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Session not found.",
        },
        {
          status: 400,
        },
      );
    }

    // Generate embedding for user query
    const [queryEmbedding] = await genAiEmbedding(query);

    // Query Chroma
    const collection = await getCollection();

    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5,
      where: {
        sessionId,
      },
      include: ["documents", "metadatas", "distances"],
    });

    const documents = results.documents?.[0] ?? [];
    const metadatas = results.metadatas?.[0] ?? [];
    const distances = results.distances?.[0] ?? [];

    // Debug
    console.table(
      documents.map((doc, index) => ({
        distance: distances[index],
        source: metadatas[index]?.source,
        page: metadatas[index]?.page,
        preview: doc.substring(0, 80),
      })),
    );

    // Filter by similarity threshold
    const THRESHOLD = 0.5;

    const relevantDocuments = [];
    const relevantSources = [];

    documents.forEach((doc, index) => {
      if (distances[index] <= THRESHOLD) {
        relevantDocuments.push(doc);
        relevantSources.push(metadatas[index]);
      }
    });

    const context =
      relevantDocuments.length > 0
        ? relevantDocuments.join("\n\n---\n\n")
        : "(no relevant document content found for this query)";

    const prompt = `
You are a helpful AI assistant for a document Q&A app. You can have normal conversation (greetings, thanks, small talk) naturally and warmly.

For questions specifically asking about document content, facts, or information:
- Use ONLY the provided context below.
- If the context doesn't contain the answer, say: "I couldn't find that information in the uploaded documents."
- Never invent facts not present in the context.

For greetings, chit-chat, or general questions about your capabilities, respond naturally and conversationally — you don't need document context for these.

------------------------
Context
------------------------

${context}

------------------------
User Question
------------------------

${query}
`;

    const response = await llm.invoke(prompt);

    return NextResponse.json({
      success: true,
      answer: response.content,
      sources: relevantSources,
    });
  } catch (error) {
    console.error("Query Error:", error);

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
