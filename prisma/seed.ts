import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.college.createMany({
    data: [
      {
        name: 'IIT Bombay',
        location: 'Mumbai',
        fees: 200000,
        rating: 4.8,
        courses: ['B.Tech CSE', 'B.Tech Mechanical', 'MBA'],
        placements: { average: 1800000, highest: 5000000 },
      },
      {
        name: 'VJTI',
        location: 'Mumbai',
        fees: 150000,
        rating: 4.5,
        courses: ['B.Tech IT', 'B.Tech Electronics'],
        placements: { average: 1200000, highest: 3500000 },
      },
      {
        name: 'Atharva College of Engineering',
        location: 'Mumbai',
        fees: 120000,
        rating: 4.1,
        courses: ['B.Tech CSE', 'B.Tech AI/DS'],
        placements: { average: 600000, highest: 1500000 },
      },
      // add 15-20 more like this — vary location, fees, rating so search/filter actually has something to filter
    ],
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })