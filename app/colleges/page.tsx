import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
interface College {
  id: string
  name: string
  location: string
  fees: number
  rating: number
}

interface ApiResponse {
  colleges: College[]
  totalPages: number
  currentPage: number
}

type Params = {
  search?: string
  location?: string
  minRating?: string
  page?: string
}

async function getColleges(params: Params): Promise<ApiResponse> {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value)
    }
  })

  const res = await fetch(
    `http://localhost:3000/api/colleges?${query.toString()}`,
    {
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch colleges')
  }

  return res.json()
}

function buildPageUrl(params: Params, page: number) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== 'page') {
      query.set(key, value)
    }
  })

  query.set('page', String(page))

  return `/colleges?${query.toString()}`
}

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<Params>
}) {
  const params = await searchParams

  const { colleges, totalPages, currentPage } =
    await getColleges(params)

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Colleges
      </h1>

      <form className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        <Input
          type="text"
          name="search"
          defaultValue={params.search}
          placeholder="Search by name..."
        />

        <Input
          type="text"
          name="location"
          defaultValue={params.location}
          placeholder="Location..."
        />

        <select
          name="minRating"
          defaultValue={params.minRating || ''}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Any rating</option>
          <option value="4.5">4.5+</option>
          <option value="4">4+</option>
          <option value="3">3+</option>
        </select>

        <Button type="submit">
          Search
        </Button>
      </form>

      <div className="grid gap-4">
        {colleges.length === 0 && (
          <p className="text-gray-500">
            No colleges found.
          </p>
        )}

        {colleges.map((college) => (
          <a
            key={college.id}
            href={`/colleges/${college.id}`}
          >
            <Card className="hover:bg-gray-50 transition-colors">
              <CardHeader>
                <CardTitle>
                  {college.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex justify-between text-sm text-gray-600">
                <span>{college.location}</span>

                <span>
                  ₹{college.fees.toLocaleString()}
                </span>

                <span>
                  {college.rating} ★
                </span>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={buildPageUrl(
                    params,
                    currentPage - 1
                  )}
                />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={buildPageUrl(
                    params,
                    currentPage + 1
                  )}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}