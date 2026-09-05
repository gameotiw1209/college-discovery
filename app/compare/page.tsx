'use client'

import { useEffect, useState } from 'react'

interface CollegeSummary {
  id: string
  name: string
  rating: number
  placementRate: number
  campusRating: number
}

type MetricKey = 'rating' | 'placementRate' | 'campusRating'

const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: 'rating', label: 'Rating', unit: '★' },
  { key: 'placementRate', label: 'Placement Rate', unit: '%' },
  { key: 'campusRating', label: 'Campus Rating', unit: '★' },
]

export default function ComparePage() {
  const [colleges, setColleges] = useState<CollegeSummary[]>([])
  const [baselineId, setBaselineId] = useState<string>('')
  const [compareId, setCompareId] = useState<string>('')
  const [activeMetric, setActiveMetric] = useState<MetricKey>('rating')

  useEffect(() => {
    fetch('/api/colleges/all')
      .then((res) => res.json())
      .then((data: { colleges: CollegeSummary[] }) => {
        setColleges(data.colleges)
        if (data.colleges.length >= 2) {
          setBaselineId(data.colleges[0].id)
          setCompareId(data.colleges[1].id)
        }
      })
  }, [])

  const baseline = colleges.find((c) => c.id === baselineId)
  const compare = colleges.find((c) => c.id === compareId)

  if (colleges.length < 2) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Need at least 2 colleges to compare.</p>
      </div>
    )
  }

  const metric = METRICS.find((m) => m.key === activeMetric)!
  const baseVal = baseline ? baseline[activeMetric] : 0
  const compVal = compare ? compare[activeMetric] : 0
  const total = baseVal + compVal || 1
  const baseWidth = (baseVal / total) * 100

  let leaderNote = 'Select two different colleges to compare.'
  if (baseline && compare) {
    if (baseVal > compVal) leaderNote = `${baseline.name} leads on this metric`
    else if (compVal > baseVal) leaderNote = `${compare.name} leads on this metric`
    else leaderNote = "It's a tie on this metric"
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4">
            <p className="text-xs text-slate-400 tracking-wide mb-1">BASELINE</p>
            <select
              value={baselineId}
              onChange={(e) => setBaselineId(e.target.value)}
              className="bg-transparent text-lg font-semibold w-full outline-none"
            >
              {colleges
                .filter((c) => c.id !== compareId)
                .map((c) => (
                  <option key={c.id} value={c.id} className="text-black">
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="shrink-0 w-10 h-10 rounded-full border border-amber-500 text-amber-500 flex items-center justify-center text-xs font-bold">
            VS
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4">
            <p className="text-xs text-slate-400 tracking-wide mb-1">COMPARE WITH</p>
            <select
              value={compareId}
              onChange={(e) => setCompareId(e.target.value)}
              className="bg-transparent text-lg font-semibold w-full outline-none"
            >
              {colleges
                .filter((c) => c.id !== baselineId)
                .map((c) => (
                  <option key={c.id} value={c.id} className="text-black">
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mb-8 justify-center">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeMetric === m.key
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-sm text-slate-400 mb-6">{metric.label}</h2>

          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-4xl font-bold">
                {baseVal}
                {metric.unit}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase">{baseline?.name}</p>
            </div>
            <span className="text-slate-500 text-sm mb-1">vs</span>
            <div className="text-right">
              <p className="text-4xl font-bold">
                {compVal}
                {metric.unit}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase">{compare?.name}</p>
            </div>
          </div>

          <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex mb-4">
            <div className="h-full bg-amber-500" style={{ width: `${baseWidth}%` }} />
            <div className="h-full bg-slate-600 flex-1" />
          </div>

          <p className="text-sm text-slate-400">{leaderNote}</p>
        </div>
      </div>
    </div>
  )
}