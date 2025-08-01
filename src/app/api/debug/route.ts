//src/app/api/debug/debug.ts

import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({ ok: true, endpoint: '/api/debug' })
}