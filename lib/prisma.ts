import { PrismaClient } from "@prisma/client";

// Save prisma in gloabl object
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
}

// If prisma already exists, use that one. Otherwise, create a new PrismaClient.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Save prisma in gloablThis only in dev mode
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}