import { NextResponse } from 'next/server'
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const { token } = await req.json()

  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  })

  if (!user) {
    return NextResponse.json({ error: 'Incorrect token.' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verifyToken: null,
    },
  })

  return NextResponse.json({ message: 'Email verification complete.' })
}
