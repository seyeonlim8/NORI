import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";

async function getUserIdFromToken(req: Request): Promise<number | null> {
  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    return decoded.userId;
  } catch {
    return null;
  }
}

// Get user info
export async function GET(req: Request) {
  const userId = await getUserIdFromToken(req);
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true },
  });

  if (!user)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  return NextResponse.json(user);
}

// Edit user info
export async function PATCH(req: Request) {
  const userId = await getUserIdFromToken(req);
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { username, password } = await req.json();

  const updateData: { username?: string; password?: string } = {};
  if (username) updateData.username = username;
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, email: true, username: true },
  });

  return NextResponse.json({ success: true, user: updatedUser });
}

// Delete user info
export async function DELETE(req: Request) {
  const userId = await getUserIdFromToken(req);
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    // Delete all dependent data in a single transaction to satisfy FKs
    await prisma.$transaction([
      prisma.reviewSession.deleteMany({ where: { userId } }),
      prisma.studyProgress.deleteMany({ where: { userId } }),
      prisma.favoriteWord.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    // Delete cookies
    const res = NextResponse.json({ success: true });
    res.cookies.set("token", "", { httpOnly: true, maxAge: 0 });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete account." },
      { status: 500 }
    );
  }
}
