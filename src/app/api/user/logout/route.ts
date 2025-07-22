import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out." });

  // Delete token from cookies
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // delete instantly
  });

  return res;
}
