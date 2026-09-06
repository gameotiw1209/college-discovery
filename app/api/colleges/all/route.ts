import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const colleges = await prisma.college.findMany({
    orderBy: { rating: 'desc' },
  })
  return NextResponse.json({ colleges })
}