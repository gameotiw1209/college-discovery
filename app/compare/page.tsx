'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface College {
  id: string
  name: string
  rating: number
  placementRate: number
  nirfRanking: number
  fees: number
}

type MetricKey = 'rating' | 'placementRate' | 'nirfRanking' | 'fees'
type TabKey = 'all' | 'placement' | 'rankings' | 'overall' | 'fees'

const METRICS: {
  key: MetricKey
  label: string
  unit: string
  lowerIsBetter?: boolean
  tab: TabKey
  source: string
}[] = [
  { key: 'placementRate', label: 'Placement Rate', unit: '%', tab: 'placement', source: 'findCareer dataset' },
  { key: 'nirfRanking', label: 'NIRF Ranking', unit: '', lowerIsBetter: true, tab: 'rankings', source: 'findCareer dataset' },
  { key: 'rating', label: 'Overall Rating', unit: '/5', tab: 'overall', source: 'findCareer dataset' },
  { key: 'fees', label: 'Total Fees', unit: '', lowerIsBetter: true, tab: 'fees', source: 'findCareer dataset' },
]

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4)
}

function CollegeDropdown({
  label, colleges, value, onChange, exclude,
}: {
  label: string
  colleges: College[]
  value: string
  onChange: (id: string) => void
  exclude: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const selected = colleges.find(c => c.id === value)
  const options = colleges.filter(
    c => c.id !== exclude && c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-left hover:border-white/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold tracking-tight">
            {selected ? initials(selected.name) : '—'}
          </span>
          <div>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">{label}</p>
            <p className="text-lg font-semibold leading-tight">{selected?.name ?? 'Select a college'}</p>
          </div>
        </div>
        <span className="text-white/30 text-sm">⌄</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl max-h-72 overflow-hidden flex flex-col">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search colleges..."
            className="bg-white/5 mx-3 mt-3 mb-2 px-3 py-2 rounded-lg text-sm outline-none border border-white/10 focus:border-white/25"
          />
          <div className="overflow-y-auto">
            {options.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onChange(c.id)
                  setOpen(false)
                  setQuery('')
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
              >
                {c.name}
              </button>
            ))}
            {!options.length && (
              <p className="px-4 py-3 text-sm text-white/30">No matches.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ComparePageContent() {
  const searchParams = useSearchParams()
  const [colleges, setColleges] = useState<College[]>([])
  const [baselineId, setBaselineId] = useState('')
  const [compareId, setCompareId] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  useEffect(() => {
    fetch('/api/colleges/all')
      .then(res => res.json())
      .then((data: { colleges: College[] }) => {
        setColleges(data.colleges)

        const ids = searchParams.get('ids')?.split(',').filter(Boolean) ?? []

        if (ids.length >= 2) {
          setBaselineId(ids[0])
          setCompareId(ids[1])
        } else if (data.colleges.length >= 2) {
          setBaselineId(data.colleges[0].id)
          setCompareId(data.colleges[1].id)
        }
      })
  }, [searchParams])

  const baseline = colleges.find(c => c.id === baselineId)
  const compare = colleges.find(c => c.id === compareId)

  const visibleMetrics = METRICS.filter(
    m => activeTab === 'all' || m.tab === activeTab
  )

  if (colleges.length < 2) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40">Need at least 2 colleges to compare.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-10 py-5 border-b border-white/10">
        <Link href="/colleges" className="font-heading text-xl font-bold tracking-tight">
          findCollege
        </Link>

        <div className="flex items-center gap-8 text-sm font-heading">
          <Link href="/colleges" className="text-white/50 hover:text-white transition-colors">
            Colleges
          </Link>
          <span className="px-4 py-1.5 rounded-full bg-white/10 font-medium">
            Compare
          </span>
        </div>

        <button className="rounded-full border border-white/15 px-4 py-1.5 text-sm hover:bg-white/10 transition-colors">
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* College selectors */}
        <div className="flex items-center gap-4 mb-10">
          <CollegeDropdown
            label="Baseline"
            colleges={colleges}
            value={baselineId}
            onChange={setBaselineId}
            exclude={compareId}
          />

          <div className="shrink-0 w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-xs font-bold">
            VS
          </div>

          <CollegeDropdown
            label="Compare with"
            colleges={colleges}
            value={compareId}
            onChange={setCompareId}
            exclude={baselineId}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 justify-center flex-wrap">
          {(['all', 'placement', 'rankings', 'overall', 'fees'] as TabKey[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'bg-white/[0.04] text-white/50 hover:text-white/80 border border-white/10'
              }`}
            >
              {tab === 'all'
                ? 'All Metrics'
                : tab === 'placement'
                  ? 'Placement'
                  : tab === 'rankings'
                    ? 'Rankings'
                    : tab === 'overall'
                      ? 'Overall'
                      : 'Fees'}
            </button>
          ))}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleMetrics.map(metric => {
            const baseVal = baseline?.[metric.key] ?? 0
            const compVal = compare?.[metric.key] ?? 0

            const baseScore = metric.lowerIsBetter ? 1 / (baseVal || 1) : baseVal
            const compScore = metric.lowerIsBetter ? 1 / (compVal || 1) : compVal
            const total = baseScore + compScore || 1
            const baseWidth = (baseScore / total) * 100

            let leaderNote = 'Select two different colleges to compare.'

            if (baseline && compare) {
              const baseWins = metric.lowerIsBetter
                ? baseVal < compVal
                : baseVal > compVal

              const compWins = metric.lowerIsBetter
                ? compVal < baseVal
                : compVal > baseVal

              if (baseWins) leaderNote = `${baseline.name} leads on this metric`
              else if (compWins) leaderNote = `${compare.name} leads on this metric`
              else leaderNote = "It's a tie on this metric"
            }

            const display = (value: number) => {
              if (metric.key === 'nirfRanking') return `#${value}`
              if (metric.key === 'fees') return `₹${value.toLocaleString('en-IN')}`
              return `${value}${metric.unit}`
            }

            return (
              <div
                key={metric.key}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/15 transition-colors"
              >
                <h2 className="text-sm text-white/50 mb-5 font-medium">
                  {metric.label}
                </h2>

                <div className="flex justify-between items-start mb-5">
                  <div>
                    <p className="text-[10px] text-white/30 mb-1.5 tracking-widest uppercase">
                      {initials(baseline?.name ?? '')}
                    </p>
                    <p className="text-4xl font-bold tracking-tight">
                      {display(baseVal)}
                    </p>
                    <p className="text-xs text-white/40 mt-1.5">
                      {baseline?.name}
                    </p>
                  </div>

                  <span className="text-white/25 text-xs mt-7 font-medium">vs</span>

                  <div className="text-right">
                    <p className="text-[10px] text-white/30 mb-1.5 tracking-widest uppercase">
                      {initials(compare?.name ?? '')}
                    </p>
                    <p className="text-4xl font-bold tracking-tight">
                      {display(compVal)}
                    </p>
                    <p className="text-xs text-white/40 mt-1.5">
                      {compare?.name}
                    </p>
                  </div>
                </div>

                <div className="h-1 rounded-full bg-white/10 overflow-hidden flex mb-4">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${baseWidth}%` }}
                  />
                  <div className="h-full bg-white/15 flex-1" />
                </div>

                <p className="text-sm text-white/60 mb-4">
                  {leaderNote}
                </p>

                <p className="text-[11px] text-white/25 border-t border-white/[0.06] pt-3">
                  Source: {metric.source}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ComparePageContent />
    </Suspense>
  )
}