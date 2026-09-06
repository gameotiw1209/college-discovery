import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const colleges = await prisma.college.findMany({
    orderBy: { rating: 'desc' },
    include:{
      reviews:true,
    }
  })
  return NextResponse.json({ colleges })
}