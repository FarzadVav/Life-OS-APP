import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: 0,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
