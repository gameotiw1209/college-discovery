import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { notFound } from 'next/navigation'
interface Placements {
  avgPackageLPA: number
  highestPackageLPA: number
  topRecruiters: string[]
  year: number
}

interface CollegeDetail {
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

async function getCollege(id: string): Promise<CollegeDetail | null> {
  const res = await fetch(`http://localhost:3000/api/colleges/${id}`, {
    cache: 'no-store',
  })

  if (res.status === 404) return null

  return res.json()
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const college = await getCollege(id)

  if (!college) notFound()

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-1">{college.name}</h1>

      <p className="text-gray-600 mb-6">
        {college.location}
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">
          Overview
        </h2>

        <p className="text-gray-700 mb-6">
          {college.overview}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Fees
            </CardTitle>
          </CardHeader>

          <CardContent className="text-xl font-semibold">
            ₹{college.fees.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Rating
            </CardTitle>
          </CardHeader>

          <CardContent className="text-xl font-semibold">
            {college.rating} ★
          </CardContent>
        </Card>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">
          Courses
        </h2>

        <ul className="list-disc list-inside text-gray-700">
          {college.courses.map((course, i) => (
            <li key={i}>
              {course}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
  <h2 className="text-lg font-semibold mb-2">Placements</h2>
  <div className="grid grid-cols-3 gap-4 mb-4">
    <Card>
      <CardHeader><CardTitle className="text-sm text-gray-500">Placement Rate</CardTitle></CardHeader>
      <CardContent className="text-xl font-semibold">{college.placementRate}%</CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-sm text-gray-500">Avg Package</CardTitle></CardHeader>
      <CardContent className="text-xl font-semibold">₹{college.placements.avgPackageLPA} LPA</CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-sm text-gray-500">Highest Package</CardTitle></CardHeader>
      <CardContent className="text-xl font-semibold">₹{college.placements.highestPackageLPA} LPA</CardContent>
    </Card>
  </div>
  <p className="text-sm text-gray-500 mb-2">Top Recruiters ({college.placements.year})</p>
  <div className="flex flex-wrap gap-2">
    {college.placements.topRecruiters.map((company) => (
      <span
        key={company}
        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
      >
        {company}
      </span>
    ))}
  </div>
</section>
     <section className="mb-8">
  <h2 className="text-lg font-semibold mb-2">Campus</h2>
  <p className="text-gray-700 mb-2">
    {college.campusSize} acres · NIRF Ranking #{college.nirfRanking}
  </p>
  <div className="flex flex-wrap gap-2">
    {college.facilities.map((facility) => (
      <span
        key={facility}
        className="px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-700"
      >
        {facility}
      </span>
    ))}
  </div>
</section>
    </div>
  )
}

