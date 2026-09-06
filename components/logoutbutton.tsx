'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }
  return (
    <button onClick={handleLogout} className="rounded-full border border-white/15 px-4 py-1.5 text-sm hover:bg-white/10 transition-colors">
      Logout
    </button>
  )
}