'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface SavedComparison {
  id: string
  collegeIds: string[]
  createdAt: string
}

export default function SavedComparisonsPage() {
  const [comparisons, setComparisons] = useState<SavedComparison[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/comparisons')
      .then((res) => res.json())
      .then((data) => {
        setComparisons(data.comparisons || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <Link href="/colleges" className="text-sm text-white/50 hover:text-white">← Back to Colleges</Link>
      <h1 className="font-heading text-2xl font-bold mt-4 mb-6">Saved Comparisons</h1>

      {loading && <p className="text-white/40">Loading...</p>}
      {!loading && comparisons.length === 0 && (
        <p className="text-white/40">No saved comparisons yet.</p>
      )}

      <div className="space-y-3">
        {comparisons.map((comp) => (
          <Link
            key={comp.id}
            href={`/compare?ids=${comp.collegeIds.join(',')}`}
            className="block rounded-xl bg-white/5 border border-white/10 p-4 hover:border-white/25 transition-colors"
          >
            <p className="text-sm text-white/50">
              {new Date(comp.createdAt).toLocaleDateString()}
            </p>
            <p className="text-white/80">{comp.collegeIds.length} colleges compared</p>
          </Link>
        ))}
      </div>
    </div>
  )
}