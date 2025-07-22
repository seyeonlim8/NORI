import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // token saved in cookies during login
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    return user;
  } catch (err) {
    return null;
  }
}
