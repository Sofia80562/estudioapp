// Importa desde la ruta de salida que configuraste en tu schema.prisma
import { PrismaClient } from '../generated/prisma'; 
import { env } from '@/lib/config/env';

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
        db: {
            url: env.DATABASE_URL,
        },
    },
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}