import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { notFound } from 'next/navigation'
interface Review {
    id:string
    content:string
    rating:number
}

interface CollegeDetail {
  id: string
  name: string
  location: string
  fees: number
  rating: number
  overview: string
  courses: string[]
  placements: {
    average: number
    highest: number
  }
  reviews: Review[]
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
        <h2 className="text-lg font-semibold mb-2">
          Placements
        </h2>

        <p className="text-gray-700">
          Average: ₹{college.placements.average.toLocaleString()}
        </p>

        <p className="text-gray-700">
          Highest: ₹{college.placements.highest.toLocaleString()}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">
          Reviews
        </h2>

        {college.reviews.length === 0 && (
          <p className="text-gray-500">
            No reviews yet.
          </p>
        )}

        {college.reviews.map((review) => (
          <Card key={review.id} className="mb-3">
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 mb-1">
                {review.rating} ★
              </p>

              <p>
                {review.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}

