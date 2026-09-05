import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const search = searchParams.get('search') || ''
  const location = searchParams.get('location') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10

  const where = {
    AND: [
      search
        ? { name: { contains: search, mode: 'insensitive' as const } }
        : {},
      location
        ? { location: { contains: location, mode: 'insensitive' as const } }
        : {},
    ],
  }

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { rating: 'desc' },
    }),
    prisma.college.count({ where }),
  ])

  return NextResponse.json({
    colleges,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  })
}