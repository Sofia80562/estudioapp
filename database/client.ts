// Se cambia la importación para usar el cliente estándar de Prisma
import { PrismaClient } from '@prisma/client';
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