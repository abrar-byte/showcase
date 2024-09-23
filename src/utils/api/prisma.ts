import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let p: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  p = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  p = global.prisma;
}

export const prismaAny = p as any;
export const prisma = p as PrismaClient;
