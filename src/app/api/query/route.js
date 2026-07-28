import { NextResponse } from "next/server";

import { getCollection } from "@/lib/chroma";
import { genAiEmbedding } from "@/lib/genAiEmbedding";
import llm from "@/lib/llm";
import { getSessionId } from "@/lib/session";

export async function POST(request) {
  try {
    const { query, history = [] } = await request.json();

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

    const historyText = history.length
      ? history
          .map(
            (m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`,
          )
          .join("\n")
      : "(no previous messages)";

    const prompt = `
You are a knowledgeable, friendly AI assistant for a document Q&A app. Answer naturally like a helpful expert would — clear, organized, and conversational, not robotic.

Guidelines:
- For document-related questions, use ONLY the provided context. Never invent facts.
- If the context doesn't have the answer, say so naturally (e.g. "I don't see that covered in the document" rather than a rigid canned line).
- For greetings, thanks, or small talk, respond warmly and naturally — no need to mention documents at all.
- If the user asks about the earlier conversation (e.g. "what did I just ask", "what was my last question", "summarize what we discussed"), answer using the Recent Conversation section below — that's real conversation history, not document content.
- Structure longer answers clearly: use short paragraphs, bullet points, or numbered steps when it improves readability. Keep answers concise — don't pad with fluff.
- Preserve exact names, numbers, dates, and technical terms exactly as they appear in the context.

------------------------
Recent Conversation
------------------------

${historyText}

------------------------
Document Context
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
