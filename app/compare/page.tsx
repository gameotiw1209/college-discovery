'use client'

import { useEffect, useState } from 'react'

interface CollegeSummary {
  id: string
  name: string
  rating: number
  placementRate: number
  nirfRanking: number
}

type MetricKey =
  | 'rating'
  | 'placementRate'
  | 'nirfRanking'

const METRICS: {
  key: MetricKey
  label: string
  description: string
  unit: string
}[] = [
  {
    key: 'rating',
    label: 'Overall Rating',
    description: 'Student & institutional rating',
    unit: '★',
  },
  {
    key: 'placementRate',
    label: 'Placement Rate',
    description: 'Percentage of students placed',
    unit: '%',
  },
  {
    key: 'nirfRanking',
    label: 'NIRF Ranking',
    description: 'India Rankings position',
    unit: '',
  },
]

export default function ComparePage() {
  const [colleges, setColleges] = useState<CollegeSummary[]>([])
  const [baselineId, setBaselineId] = useState('')
  const [compareId, setCompareId] = useState('')
  const [activeMetric, setActiveMetric] =
    useState<MetricKey>('rating')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadColleges() {
      try {
        const res = await fetch('/api/colleges/all')

        if (!res.ok) {
          throw new Error('Failed to fetch colleges')
        }

        const data: { colleges: CollegeSummary[] } =
          await res.json()

        setColleges(data.colleges)

        if (data.colleges.length >= 2) {
          setBaselineId(data.colleges[0].id)
          setCompareId(data.colleges[1].id)
        }
      } catch (error) {
        console.error(error)
        setError('Unable to load colleges.')
      } finally {
        setLoading(false)
      }
    }

    loadColleges()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">
          Loading colleges...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    )
  }

  if (colleges.length < 2) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">
          You need at least two colleges to compare.
        </p>
      </main>
    )
  }

  const baseline = colleges.find(
    (college) => college.id === baselineId
  )

  const compare = colleges.find(
    (college) => college.id === compareId
  )

  const metric = METRICS.find(
    (metric) => metric.key === activeMetric
  )!

  const baseVal = baseline?.[activeMetric] ?? 0
  const compVal = compare?.[activeMetric] ?? 0

  /*
    Rating + Placement Rate:
      higher = better

    NIRF:
      lower = better
  */
  const baselineWins =
    activeMetric === 'nirfRanking'
      ? baseVal < compVal
      : baseVal > compVal

  const compareWins =
    activeMetric === 'nirfRanking'
      ? compVal < baseVal
      : compVal > baseVal

  const tie = baseVal === compVal

  let winnerText = ''

  if (tie) {
    winnerText = 'Both colleges are equal on this metric.'
  } else if (baselineWins) {
    winnerText = `${baseline?.name} leads on ${metric.label.toLowerCase()}.`
  } else if (compareWins) {
    winnerText = `${compare?.name} leads on ${metric.label.toLowerCase()}.`
  }

  /*
    For the visual comparison bar:
    higher value gets larger width for rating/placement.

    For NIRF, reverse the values because a smaller rank is better.
  */

  let baseScore = baseVal
  let compScore = compVal

  if (activeMetric === 'nirfRanking') {
    baseScore = baseVal > 0 ? 1 / baseVal : 0
    compScore = compVal > 0 ? 1 / compVal : 0
  }

  const total = baseScore + compScore

  const baseWidth =
    total > 0 ? (baseScore / total) * 100 : 50

  const compWidth =
    total > 0 ? (compScore / total) * 100 : 50

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">

          <p className="text-sm font-medium text-indigo-600 mb-2">
            COLLEGE DISCOVERY
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Compare colleges
          </h1>

          <p className="text-slate-500 mt-2 max-w-xl">
            Compare colleges across ratings, placement
            performance and NIRF ranking.
          </p>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* College selectors */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">

          {/* Baseline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-xs font-semibold tracking-wider text-slate-400 mb-2">
              COLLEGE 1
            </p>

            <select
              value={baselineId}
              onChange={(e) =>
                setBaselineId(e.target.value)
              }
              className="w-full bg-transparent text-lg font-semibold text-slate-900 outline-none cursor-pointer"
            >
              {colleges
                .filter(
                  (college) => college.id !== compareId
                )
                .map((college) => (
                  <option
                    key={college.id}
                    value={college.id}
                  >
                    {college.name}
                  </option>
                ))}
            </select>

          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-600">
                VS
              </span>
            </div>
          </div>

          {/* Compare */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-xs font-semibold tracking-wider text-slate-400 mb-2">
              COLLEGE 2
            </p>

            <select
              value={compareId}
              onChange={(e) =>
                setCompareId(e.target.value)
              }
              className="w-full bg-transparent text-lg font-semibold text-slate-900 outline-none cursor-pointer"
            >
              {colleges
                .filter(
                  (college) => college.id !== baselineId
                )
                .map((college) => (
                  <option
                    key={college.id}
                    value={college.id}
                  >
                    {college.name}
                  </option>
                ))}
            </select>

          </div>

        </div>

        {/* Metric selector */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">

          {METRICS.map((item) => {
            const active =
              activeMetric === item.key

            return (
              <button
                key={item.key}
                onClick={() =>
                  setActiveMetric(item.key)
                }
                className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {item.label}
              </button>
            )
          })}

        </div>

        {/* Main comparison card */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-7 py-6 border-b border-slate-100">

            <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
              Comparison
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {metric.label}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {metric.description}
            </p>

          </div>

          {/* Values */}
          <div className="p-7">

            <div className="grid grid-cols-2 gap-8">

              {/* Baseline */}
              <div>
                <p className="text-sm text-slate-500 mb-3">
                  {baseline?.name}
                </p>

                <div className="flex items-baseline gap-1">

                  <span
                    className={`text-5xl font-bold ${
                      baselineWins
                        ? 'text-indigo-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {baseVal}
                  </span>

                  <span className="text-lg text-slate-400">
                    {metric.unit}
                  </span>

                </div>

                {baselineWins && !tie && (
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                    Leading
                  </span>
                )}
              </div>

              {/* Compare */}
              <div className="text-right">

                <p className="text-sm text-slate-500 mb-3">
                  {compare?.name}
                </p>

                <div className="flex items-baseline justify-end gap-1">

                  <span
                    className={`text-5xl font-bold ${
                      compareWins
                        ? 'text-indigo-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {compVal}
                  </span>

                  <span className="text-lg text-slate-400">
                    {metric.unit}
                  </span>

                </div>

                {compareWins && !tie && (
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                    Leading
                  </span>
                )}

              </div>

            </div>

            {/* Comparison bar */}
            <div className="mt-8">

              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">

                <div
                  className={`h-full transition-all duration-500 rounded-l-full ${
                    baselineWins
                      ? 'bg-indigo-600'
                      : 'bg-slate-300'
                  }`}
                  style={{
                    width: `${baseWidth}%`,
                  }}
                />

                <div
                  className={`h-full transition-all duration-500 rounded-r-full ${
                    compareWins
                      ? 'bg-indigo-600'
                      : 'bg-slate-300'
                  }`}
                  style={{
                    width: `${compWidth}%`,
                  }}
                />

              </div>

            </div>

            {/* Winner */}
            <div className="mt-7 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-sm text-slate-600">
                {winnerText}
              </p>
            </div>

          </div>

        </div>

        {/* Metric explanation */}
        <div className="mt-6 text-center">

          <p className="text-xs text-slate-400">
            {activeMetric === 'nirfRanking'
              ? 'For NIRF ranking, a lower number represents a better rank.'
              : 'Higher values indicate stronger performance.'}
          </p>

        </div>

      </div>
    </main>
  )
}