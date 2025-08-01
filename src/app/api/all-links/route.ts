import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const now = new Date();

    const urls = await prisma.shortLink.findMany({
      where: {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ message: 'ok', links: urls }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching all links:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}