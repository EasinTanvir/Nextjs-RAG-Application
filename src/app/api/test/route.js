import path from "path";
import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function GET() {
  const filePath = path.join(process.cwd(), "docs", "RICHARD_CV.pdf");

  // Instantiate the loader
  const loader = new PDFLoader(filePath, {
    splitPages: true, // Set to false to return a single document for the entire PDF
  });

  // Load the documents
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", ". ", " "],
  });

  const chunks = await splitter.splitDocuments(docs);

  console.log({ chunks });
  return NextResponse.json({ chunks, docs });
}
