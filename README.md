# 📄 Next.js RAG Application

A Retrieval-Augmented Generation (RAG) application built with **Next.js** that allows users to upload PDF documents and ask questions about their content using AI.

The application extracts text from uploaded PDFs, converts it into embeddings, stores them in a vector database, and retrieves the most relevant context before generating an answer with an LLM.

## ✨ Features

- 📄 Upload PDF documents
- ✂️ Automatic document chunking
- 🧠 Gemini Embedding (`gemini-embedding-001`)
- 🗄️ Chroma Cloud Vector Database
- 🔎 Semantic similarity search
- 🤖 AI-powered question answering using Groq (Llama 3.3 70B)
- 📚 Source citations with page references
- 💬 Session-based chat history
- 🎨 Modern UI built with Next.js and Tailwind CSS

---

## 🚀 Live Demo

https://nextjs-rag-application-eosin.vercel.app/

---

## 🏗️ RAG Pipeline

### 📥 Ingestion Pipeline

```
Upload PDF
      │
      ▼
Extract Text
      │
      ▼
Split into Chunks
      │
      ▼
Generate Embeddings
      │
      ▼
Store in ChromaDB
```

### 🔎 Retrieval Pipeline

```
User Question
      │
      ▼
Generate Query Embedding
      │
      ▼
Semantic Search
      │
      ▼
Retrieve Relevant Chunks
      │
      ▼
Send Context to LLM
      │
      ▼
Generate Grounded Answer
```

---

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React
- JavaScript
- Tailwind CSS

### AI

- LangChain
- Google Gemini Embedding API
- Groq
- Llama 3.3 70B Versatile

### Vector Database

- Chroma Cloud

### PDF Processing

- LangChain PDF Loader
- Recursive Character Text Splitter

---

## 📦 Project Structure

```
app/
 ├── api/
 ├── components/
 ├── actions/
 └── page.js

hooks/
 └── useChatSession.js

lib/
 ├── chroma.js
 ├── genAiEmbedding.js
 ├── llm.js
 └── session.js
```

---

## ⚙️ Implementation Details

| Feature             | Implementation                    |
| ------------------- | --------------------------------- |
| Chunking Strategy   | Recursive Character Text Splitter |
| Embedding Model     | gemini-embedding-001              |
| Embedding Dimension | 512                               |
| Vector Database     | Chroma Cloud                      |
| LLM                 | Groq (Llama 3.3 70B Versatile)    |
| Session Storage     | Browser Session Storage           |

---

## 🔑 Environment Variables

Create a `.env.local` file.

```env
GOOGLE_API_KEY=your_google_api_key

GROQ_API_KEY=your_groq_api_key

CHROMA_API_KEY=your_chroma_api_key
CHROMA_TENANT=your_chroma_tenant
CHROMA_DATABASE=your_chroma_database
```

---

## 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/EasinTanvir/Nextjs-RAG-Application.git
```

Go to the project

```bash
cd Nextjs-RAG-Application
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## 📸 Preview

> Add screenshots or a GIF of the application here.

---

## 🧠 How It Works

1. Upload a PDF document.
2. Extract text from the document.
3. Split the text into semantic chunks.
4. Generate embeddings using Gemini Embedding.
5. Store embeddings in Chroma Cloud.
6. Convert the user's question into an embedding.
7. Retrieve the most relevant chunks using semantic similarity search.
8. Send the retrieved context to the LLM.
9. Return an answer with source citations.

---

## 📈 Future Improvements

- Multiple document support
- Streaming responses
- Hybrid search (Vector + Keyword)
- Conversation memory
- Authentication
- Chat history persistence
- Support for DOCX and TXT files

---

## ⭐ Support

If you found this project helpful, consider giving it a **Star ⭐** on GitHub.

It helps others discover the project and motivates me to build more open-source applications.

---

## 👨‍💻 Author

**MD Easin**

GitHub: https://github.com/EasinTanvir
