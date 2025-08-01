import { PrismaClient } from '@prisma/client';

declare global {
    // This is a global singleton to prevent the 
    // PrismaClient from being instantiated multiple times
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;