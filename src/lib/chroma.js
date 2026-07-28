import { CloudClient } from "chromadb";

const chromaClient = new CloudClient();

let collection = null;

export async function getCollection() {
  if (!collection) {
    console.log("Creating Chroma collection...");

    collection = await chromaClient.getOrCreateCollection({
      name: "our-pdf-rag-system",
    });

    console.log(" Chroma collection ready");
  }

  return collection;
}
