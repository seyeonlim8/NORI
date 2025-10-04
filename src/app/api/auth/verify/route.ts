import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const { token } = await req.json();

  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  });

  if (!user) {
    return NextResponse.json({ error: "Incorrect token." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verifyToken: null,
    },
  });

  return NextResponse.json({ message: "Email verification complete." });
}

export async function GET(req: Request) {
  if (process.env.ALLOW_TEST_API !== "true") {
    return NextResponse.json({ error: "disabled" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { verifyToken: token } });
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  return NextResponse.json({
    isVerified: !!user.isVerified,
    email: user.email,
  });
}
