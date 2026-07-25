"use server";

import fs from "fs/promises";
import os from "os";
import path from "path";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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

    // Convert browser File -> Buffer
    const bytes = Buffer.from(await file.arrayBuffer());

    // Save temporarily
    tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);

    await fs.writeFile(tempFilePath, bytes);

    // Load PDF
    const loader = new PDFLoader(tempFilePath, {
      splitPages: true,
    });

    const docs = await loader.load();

    console.log(` Loaded ${docs.length} page(s)`);

    // Recursive chunking
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", ". ", " "],
    });

    const chunks = await splitter.splitDocuments(docs);

    console.log(` Created ${chunks.length} chunks`);

    return {
      success: true,
      data: {
        totalPages: docs.length,
        totalChunks: chunks.length,
        chunks: chunks.map((chunk, index) => ({
          id: index + 1,
          pageContent: chunk.pageContent,
          metadata: {
            source: chunk.metadata.source,
            page: chunk.metadata.loc?.pageNumber,
          },
        })),
      },
    };
  } catch (error) {
    console.error("❌ uploadDocument Error");
    console.error(error);

    return {
      success: false,
      message:
        error.message || "Something went wrong while processing the document.",
    };
  } finally {
    // Delete temporary file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
        console.log("🗑️ Temporary file deleted");
      } catch (err) {
        console.warn("⚠️ Failed to delete temporary file:", err.message);
      }
    }
  }
}
