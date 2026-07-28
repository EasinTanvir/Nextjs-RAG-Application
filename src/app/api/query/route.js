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

    console.log("relevantDocuments", relevantDocuments);

    if (relevantDocuments.length === 0) {
      return NextResponse.json({
        success: true,
        answer: "I couldn't find that information in the uploaded documents.",
        sources: [],
      });
    }

    // Build context
    const context = relevantDocuments.join("\n\n---\n\n");
    console.log("context", context);
    const prompt = `
You are an intelligent AI assistant that answers questions about an uploaded PDF document.

Your job is to answer the user's question using ONLY the provided context.

The context consists of retrieved sections from the uploaded document. These sections may not represent the entire document.

Rules:

1. Use ONLY the provided context.
2. Never invent information.
3. If the answer is not supported by the context, reply exactly:

"I couldn't find that information in the uploaded documents."

4. If the user asks for a summary, overview, or what the document is about, summarize ONLY the provided context.

5. If the context partially answers the question, explain only what is supported.

6. Never mention embeddings, vector databases, chunking, retrieval systems, or internal implementation details.

7. Format the answer naturally using paragraphs or bullet points when appropriate.

------------------------
Context
------------------------

${context}

------------------------
User Question
------------------------

${query}

------------------------
Answer
------------------------
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
