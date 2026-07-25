"use server";

import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { getCollection } from "@/lib/chroma";
import { genAiEmbedding } from "@/lib/genAiEmbedding";

export async function uploadDocument(formData) {
  let tempFilePath = "";

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

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", ". ", " "],
    });

    const chunks = await splitter.splitDocuments(docs);

    const ids = chunks.map(() => crypto.randomUUID());

    const documents = chunks.map((chunk) => chunk.pageContent);

    const metadatas = chunks.map((chunk) => ({
      source: file.name,
      page: chunk.metadata.loc?.pageNumber ?? 1,
    }));

    const embeddings = await genAiEmbedding(documents);

    const collection = await getCollection();

    await collection.add({
      ids,
      documents,
      embeddings,
      metadatas,
    });

    return {
      success: true,
      message: "PDF uploaded successfully.",
      data: {
        pages: docs.length,
        chunks: chunks.length,
      },
    };
  } catch (error) {
    console.error("❌ uploadDocument Error");
    console.error(error);

    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  } finally {
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
        console.log("🗑️ Temporary file deleted");
      } catch (err) {
        console.warn("Failed to delete temporary file:", err.message);
      }
    }
  }
}
