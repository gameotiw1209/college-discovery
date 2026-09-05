import { prisma } from "../lib/prisma";

async function main() {
  await prisma.college.createMany({
  data: [
    {
      name: 'IIT Bombay',
      location: 'Mumbai',
      fees: 200000,
      rating: 4.8,
      overview:
        'One of India\'s premier engineering institutes, established in 1958. Known for rigorous academics, strong research output, and a highly competitive admission process via JEE Advanced. The Powai campus houses top-tier labs and a vibrant residential student culture.',
      courses: ['B.Tech CSE', 'B.Tech Mechanical', 'MBA'],
      placements: { average: 1800000, highest: 5000000 },
    },
    {
      name: 'VJTI',
      location: 'Mumbai',
      fees: 150000,
      rating: 4.5,
      overview:
        'A well-established government engineering college in Mumbai with over a century of history. Strong industry connections and a solid reputation in electronics and IT, with a moderately competitive admission process through MHT-CET.',
      courses: ['B.Tech IT', 'B.Tech Electronics'],
      placements: { average: 1200000, highest: 3500000 },
    },
    {
      name: 'Atharva College of Engineering',
      location: 'Mumbai',
      fees: 120000,
      rating: 4.1,
      overview:
        'A growing private engineering college in Mumbai focused on practical, industry-relevant curriculum. Offers a more accessible admission process while steadily expanding its placement network in CSE and emerging tech fields like AI/DS.',
      courses: ['B.Tech CSE', 'B.Tech AI/DS'],
      placements: { average: 600000, highest: 1500000 },
    },
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