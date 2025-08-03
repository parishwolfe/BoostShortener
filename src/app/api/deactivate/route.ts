import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/db/prisma";

/**
 * API route to deactivate a short link by its short code.
 * This route updates the isActive status of the link to false.
 *
 * @param req - The incoming request object containing the short code.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(req: NextRequest) {
  try {
    const { shortCode } = await req.json();

    if (!shortCode || typeof shortCode !== 'string') {
      return NextResponse.json({ error: 'Invalid short code' }, { status: 400 });
    }

    // Find the short link record by shortCode
    const link = await prisma.shortLink.findUnique({
      where: { shortCode }
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Deactivate the link by setting isActive to false
    const updatedLink = await prisma.shortLink.update({
      where: { shortCode },
      data: { isActive: false }
    });

    return NextResponse.json({ message: 'Link deactivated', link: updatedLink }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deactivating link:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}