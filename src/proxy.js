import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export function proxy(request) {
  const response = NextResponse.next();

  const session = request.cookies.get("rag_session");

  if (!session) {
    response.cookies.set({
      name: "rag_session",
      value: randomUUID(),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
