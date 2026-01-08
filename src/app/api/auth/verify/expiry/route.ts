import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export async function POST(req: Request) {
  if (process.env.ALLOW_TEST_API !== "true") {
    return NextResponse.json({ error: "disabled" }, { status: 403 });
  }

  const body = await req.json();
  const email = body?.email as string | undefined;
  const minutesOffset = body?.minutesOffset as number | undefined;
  const expiresAt = body?.expiresAt as string | undefined;

  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  let targetDate: Date | null = null;
  if (typeof minutesOffset === "number" && Number.isFinite(minutesOffset)) {
    targetDate = new Date(Date.now() + minutesOffset * 60 * 1000);
  } else if (typeof expiresAt === "string") {
    const parsed = new Date(expiresAt);
    if (!Number.isNaN(parsed.getTime())) {
      targetDate = parsed;
    }
  }

  if (!targetDate) {
    return NextResponse.json(
      { error: "minutesOffset (number) or expiresAt (ISO string) required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  await prisma.user.update({
    where: { email },
    data: { verifyTokenExpiresAt: targetDate },
  });

  return NextResponse.json({ email, verifyTokenExpiresAt: targetDate });
}
