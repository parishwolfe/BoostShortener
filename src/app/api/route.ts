// src/app/api/route.ts
import { NextResponse } from 'next/server'

/**
 * Default API route handler.
 * This route can be used to check the API status or provide basic information.
 *
 * @returns A JSON response indicating the API is working.
 */
export async function GET() {
    return NextResponse.json({ ok: true, path: '/api' })
}