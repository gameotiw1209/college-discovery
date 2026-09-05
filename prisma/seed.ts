import { prisma } from "../lib/prisma";
import collegeData from "./college-data.json"

async function main() {
  await prisma.college.createMany({
  data: collegeData
})
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })