import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/prisma';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

// Convert a numeric id to a base-64 encoded string (removing any padding)
function encodeBase64(num: number): string {
  const buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32BE(num);
  return buffer.toString('base64').replace(/=+$/, '');
}

/**
 * API route to create a new short link.
 * This route accepts a URL, validates it, and returns a short code.
 *
 * @param req - The incoming request object containing the URL.
 * @returns A JSON response with the short code or an error message.
 */
export async function POST(req: NextRequest) {
  try {
    // Rate Limit Check
    // In a real app, you might use 'X-Forwarded-For' or similar from headers
    // Here we'll use a placeholder IP or 'global' if not available for simplicity in demo
    // NOTE: NextRequest ip accessor might behave differently locally vs deployed
    const ip = req.ip ?? '127.0.0.1';
    try {
      await limiter.check(5, ip); // 5 requests per minute per IP
    } catch {
      return NextResponse.json(
        { error: 'Rate Limit Exceeded' },
        { status: 429 }
      );
    }


    const body = await req.json();
    console.log('Received body:', JSON.stringify(body));
    const { url } = body;

    // Use the built-in URL constructor to validate the URL.
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Invalid URL',
          message: `Provided URL is not valid: ${url}`
        },
        { status: 400 }
      );
    }

    // Check if the URL already exists
    let existing = await prisma.shortLink.findFirst({
      where: { originalUrl: url },
    });

    if (existing) {
      if (!existing.isActive) {
        existing = await prisma.shortLink.update({
          where: { id: existing.id },
          data: { isActive: true },
        });
      }
      return NextResponse.json(
        { shortCode: existing.shortCode, url: existing.originalUrl },
        { status: 200 }
      );
    }

    // Create the record WITHOUT the shortCode so that a serial id is generated.
    const created = await prisma.shortLink.create({
      data: {
        originalUrl: url,
        isActive: true,
      },
    });

    // Generate the shortCode from the auto-generated id using base-64 encoding.
    const shortCode = encodeBase64(created.id);

    // Update the record with the generated shortCode.
    const shortLink = await prisma.shortLink.update({
      where: { id: created.id },
      data: { shortCode }
    });

    return NextResponse.json(
      { shortCode, url: shortLink.originalUrl },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("Error in POST /api/shorten:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}