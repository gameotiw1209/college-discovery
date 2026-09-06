import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ liked: [] })

  const saved = await prisma.savedCollege.findMany({ where: { userId: user.id } })
  return NextResponse.json({ liked: saved.map((s) => s.collegeId) })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { collegeId } = await request.json()
  await prisma.savedCollege.create({ data: { userId: user.id, collegeId } })
  return NextResponse.json({ liked: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { collegeId } = await request.json()
  await prisma.savedCollege.deleteMany({ where: { userId: user.id, collegeId } })
  return NextResponse.json({ liked: false })
}