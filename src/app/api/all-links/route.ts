import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        const urls = await prisma.shortLink.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ message: 'ok', shortCodes: urls }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error fetching all links:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}