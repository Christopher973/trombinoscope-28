import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
}

export async function createContext(): Promise<Context> {
  return { prisma };
}