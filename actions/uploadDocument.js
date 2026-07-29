"use server";

import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { getCollection } from "@/lib/chroma";
import { genAiEmbedding } from "@/lib/genAiEmbedding";
import { getSessionId } from "@/lib/session";

const MAX_PAGES = 3;

export async function uploadDocument(formData) {
  let tempFilePath = "";
  const sessionId = await getSessionId();
  try {
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file uploaded.");
    }

    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed.");
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);

    await fs.writeFile(tempFilePath, bytes);

    const loader = new PDFLoader(tempFilePath, {
      splitPages: true,
    });

    const docs = await loader.load();

    if (docs.length > MAX_PAGES) {
      throw new Error(
        `PDF has ${docs.length} pages. Maximum allowed is ${MAX_PAGES} pages.`,
      );
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", ". ", " "],
    });

    const chunks = await splitter.splitDocuments(docs);
    const validChunks = chunks.filter(
      (chunk) => chunk.pageContent && chunk.pageContent.trim().length > 0,
    );

    const ids = validChunks.map(() => crypto.randomUUID());

    const documents = validChunks.map((chunk) => chunk.pageContent);

    const metadatas = validChunks.map((chunk) => ({
      sessionId,
      source: file.name,
      page: chunk.metadata.loc?.pageNumber ?? 1,
    }));

    const embeddings = await genAiEmbedding(documents);

    if (
      ids.length !== documents.length ||
      documents.length !== embeddings.length ||
      embeddings.length !== metadatas.length
    ) {
      throw new Error(
        `Array length mismatch: ids=${ids.length}, documents=${documents.length}, embeddings=${embeddings.length}, metadatas=${metadatas.length}`,
      );
    }

    const collection = await getCollection();

    const ADD_BATCH_SIZE = 100;

    for (let i = 0; i < ids.length; i += ADD_BATCH_SIZE) {
      await collection.add({
        ids: ids.slice(i, i + ADD_BATCH_SIZE),
        documents: documents.slice(i, i + ADD_BATCH_SIZE),
        embeddings: embeddings.slice(i, i + ADD_BATCH_SIZE),
        metadatas: metadatas.slice(i, i + ADD_BATCH_SIZE),
      });
    }
    return {
      success: true,
      message: "PDF uploaded successfully.",
      data: {
        pages: docs.length,
        chunks: validChunks.length,
      },
    };
  } catch (error) {
    console.error("uploadDocument Error");
    console.error(error);

    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  } finally {
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
        console.log(" Temporary file deleted");
      } catch (err) {
        console.warn("Failed to delete temporary file:", err.message);
      }
    }
  }
}
