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

    console.log("context", context);

    // Prompt
    const prompt = `
You are an intelligent AI assistant that answers questions about an uploaded PDF document.

Your job is to answer the user's question using ONLY the provided context.

The context consists of retrieved sections from the uploaded document. These sections may not represent the entire document.

## Rules

1. Use ONLY the information contained in the provided context.
2. Never invent, assume, or make up information.
3. If the context does not contain enough information to answer the question, respond exactly with:

"I couldn't find that information in the uploaded documents."

4. If the user asks for:
   - a summary,
   - an overview,
   - the purpose of the document,
   - the main topics,
   - what the document is about,

   then create the best possible summary using ONLY the provided context. Do not assume missing sections exist.

5. If the user asks whether you know the document, whether you've read it, or what it contains, answer based only on the provided context.

6. If the context only partially answers the question, clearly state what is supported by the context and mention that additional information was not found.

7. Never mention embeddings, vector databases, chunking, retrieval systems, or internal implementation details.

8. Keep answers:
   - accurate
   - concise
   - well-structured
   - easy to read

9. When appropriate, use bullet points or numbered lists.

10. If the answer contains names, dates, numbers, or technical details, copy them accurately from the context without modifying them.

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
