'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Placements {
  avgPackageLPA: number
  highestPackageLPA: number
  topRecruiters: string[]
  year: number
}

interface College {
  id: string
  name: string
  location: string
  fees: number
  rating: number
  overview: string
  courses: string[]
  placementRate: number
  placements: Placements
  campusSize: number
  nirfRanking: number
  facilities: string[]
}

type Tab = 'overview' | 'fees' | 'campus'

export default function CollegesPage() {
  const router = useRouter()

  const [colleges, setColleges] = useState<College[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [locationFilter, setLocationFilter] = useState('')
  const [sortByNirf, setSortByNirf] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const [page, setPage] = useState(1)
  const pageSize = 10 // 5 columns × 2 rows

  useEffect(() => {
    fetch('/api/colleges/all')
      .then((res) => res.json())
      .then((data: { colleges: College[] }) => setColleges(data.colleges))
  }, [])
//logic for sorting things 
  const filtered = useMemo(() => {
  let list = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      c.rating >= minRating &&
      c.location.toLowerCase().includes(locationFilter.toLowerCase())
  )

  if (sortByNirf) {
    list = [...list].sort(
      (a, b) => a.nirfRanking - b.nirfRanking
    )
  }

  return list
}, [colleges, search, minRating, locationFilter, sortByNirf])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [search, minRating, locationFilter, sortByNirf])

  const selected = colleges.find((c) => c.id === selectedId)

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const openDetail = (id: string) => {
    setSelectedId(id)
    setActiveTab('overview')
  }

  const backToGrid = () => setSelectedId(null)

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-10 py-5 border-b border-white/10">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight">findCollege</Link>
        <div className="flex items-center gap-8 text-sm font-heading">
          <span className="px-4 py-1.5 rounded-full bg-white/10">Colleges</span>
          <Link href={`/compare?ids=${compareIds.join(',')}`} className="text-white/50 hover:text-white transition-colors">
            Compare ({compareIds.length})
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full border border-white/15 px-4 py-1.5 text-sm hover:bg-white/10 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <div className="px-10 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-heading text-2xl font-bold">Colleges</h1>
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">
            {colleges.length} premier institutes
          </span>
          {selected && (
            <button
              onClick={backToGrid}
              className="ml-auto text-sm px-4 py-1.5 rounded-full border border-white/15 hover:bg-white/10 transition-colors"
            >
              ← Back to all colleges
            </button>
          )}
        </div>

        {!selected && (
          <div className="flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges..."
              className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none focus:border-white/30"
            />
            <input
  type="text"
  value={locationFilter}
  onChange={(e) => setLocationFilter(e.target.value)}
  placeholder="Filter by location..."
  className="bg-black/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white outline-none placeholder:text-white/40"
/>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-black border border-white/20 rounded-full px-4 py-2 text-sm text-white outline-none"
            >
              <option value={0} className="bg-black text-white">All Ratings</option>
              <option value={3} className="bg-black text-white">3+ Stars</option>
              <option value={3.5} className="bg-black text-white">3.5+ Stars</option>
              <option value={4} className="bg-black text-white">4+ Stars</option>
              <option value={4.5} className="bg-black text-white">4.5+ Stars</option>
            </select>
            <button
              onClick={() => setSortByNirf((v) => !v)}
              className={`rounded-full px-4 py-2 text-sm border transition-colors ${
                sortByNirf ? 'bg-white text-black border-white' : 'border-white/10 text-white/70'
              }`}
            >
              Sort: NIRF Rank
            </button>
          </div>
        )}
      </div>

      {/* GRID VIEW — default */}
      {!selected && (
        <div className="px-10 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {paginated.map((college) => (
              <button
                key={college.id}
                type="button"
                onClick={() => openDetail(college.id)}
                className="text-left rounded-2xl border border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10 transition-colors p-4 flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/70">
                    NIRF #{college.nirfRanking}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold">★ {college.rating}</span>
                </div>
                <h3 className="font-heading text-sm font-bold leading-tight mb-1">{college.name}</h3>
                <p className="text-xs text-white/50 mb-3">{college.location}</p>
                <div className="mt-auto space-y-1">
                  <p className="text-xs text-white/40">₹{college.fees.toLocaleString()} fees</p>
                  <p className="text-xs text-white/40">₹{college.placements.avgPackageLPA} LPA avg</p>
                </div>
                <span
                  onClick={(e) => { e.stopPropagation(); toggleCompare(college.id) }}
                  className={`mt-3 text-center text-[11px] px-2 py-1.5 rounded-full border cursor-pointer ${
                    compareIds.includes(college.id)
                      ? 'bg-white text-black border-white'
                      : 'border-white/20 text-white/70'
                  }`}
                >
                  {compareIds.includes(college.id) ? '✓ Comparing' : '+ Compare'}
                </span>
              </button>
            ))}
          </div>

          {paginated.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-white/50">No colleges found.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 max-w-md mx-auto">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-sm px-4 py-2 rounded-full border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-white/50">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-sm px-4 py-2 rounded-full border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* DETAIL VIEW — only after a click */}
      {selected && (
        <div className="px-10 pb-24">
          <div className="rounded-2xl border border-white/10 overflow-hidden max-w-3xl mx-auto">
            <div className="relative h-56 bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-end p-6">
              <div className="absolute top-4 left-4">
                <span className="text-xs px-3 py-1 rounded-full bg-black/60 border border-white/10">
                  NIRF #{selected.nirfRanking}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="text-xs px-3 py-1 rounded-full bg-black/60 border border-white/10">
                  ★ {selected.rating}
                </span>
              </div>
              <h2 className="font-serif text-4xl">{selected.name}</h2>
            </div>

            <div className="p-6">
              <p className="text-sm text-white/50 mb-6">{selected.location}</p>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center rounded-xl bg-white/5 py-4">
                  <p className="text-xs text-white/40 uppercase mb-1">Highest Package</p>
                  <p className="font-heading text-lg font-bold">₹{selected.placements.highestPackageLPA} LPA</p>
                </div>
                <div className="text-center rounded-xl bg-white/5 py-4">
                  <p className="text-xs text-white/40 uppercase mb-1">Average Package</p>
                  <p className="font-heading text-lg font-bold">₹{selected.placements.avgPackageLPA} LPA</p>
                </div>
                <div className="text-center rounded-xl bg-white/5 py-4">
                  <p className="text-xs text-white/40 uppercase mb-1">Placement Rate</p>
                  <p className="font-heading text-lg font-bold">{selected.placementRate}%</p>
                </div>
                <div className="text-center rounded-xl bg-white/5 py-4">
                  <p className="text-xs text-white/40 uppercase mb-1">NIRF Rank</p>
                  <p className="font-heading text-lg font-bold">#{selected.nirfRanking}</p>
                </div>
              </div>

              <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                {(['overview', 'fees', 'campus'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-sm capitalize ${
                      activeTab === tab ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {tab === 'overview' ? 'Overview & Recruiters' : tab === 'fees' ? 'Fees' : 'Campus & Facilities'}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div>
                  <p className="text-white/70 mb-6 leading-relaxed">{selected.overview}</p>
                  <p className="text-xs text-white/40 uppercase mb-3">Recruiters ({selected.placements.year})</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selected.placements.topRecruiters.map((r) => (
                      <span key={r} className="px-3 py-1.5 rounded-full bg-white/10 text-sm">{r}</span>
                    ))}
                  </div>
                  <p className="text-xs text-white/40 uppercase mb-3">Courses</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.courses.map((c) => (
                      <span key={c} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'fees' && (
                <div className="rounded-xl bg-white/5 p-6">
                  <p className="text-xs text-white/40 uppercase mb-2">Total Fees</p>
                  <p className="text-3xl font-heading font-bold">₹{selected.fees.toLocaleString()}</p>
                </div>
              )}

              {activeTab === 'campus' && (
                <div>
                  <p className="text-white/70 mb-4">{selected.campusSize} acre campus</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.facilities.map((f) => (
                      <span key={f} className="px-3 py-1.5 rounded-full bg-white/10 text-sm">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {compareIds.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black rounded-full px-6 py-3 flex items-center gap-4 shadow-lg">
          <span className="text-sm font-medium">{compareIds.length} colleges selected</span>
          <button onClick={() => setCompareIds([])} className="text-sm text-black/60">Clear</button>
          <button
            onClick={() => router.push(`/compare?ids=${compareIds.join(',')}`)}
            className="bg-black text-white text-sm px-4 py-2 rounded-full"
          >
            Compare Now →
          </button>
        </div>
      )}
    </div>
  )
}