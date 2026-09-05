import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const colleges = await prisma.college.findMany({
    select: { id: true, name: true, rating: true, placementRate: true, nirfRanking: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json({ colleges })
}