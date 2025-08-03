import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/db/prisma";

/**
 * API route to fetch all short links from the database.
 * This route returns a JSON response with the list of links.
 *
 * @param req - The incoming request object.
 * @returns A JSON response containing the list of short links or an error message.
 */
export async function GET(req: NextRequest) {
  try {
    const urls = await prisma.shortLink.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ message: 'ok', links: urls }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching all links:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}