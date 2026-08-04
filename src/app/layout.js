import { Toaster } from "react-hot-toast";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
export const metadata = {
  title: "RAG Lab",
  description: "rag system",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${mono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
