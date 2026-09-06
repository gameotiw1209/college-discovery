import { prisma } from "../lib/prisma";
import collegeData from "./college-data.json";
import reviewData from "./review-data.json";

async function main() {
  // Seed colleges
  await prisma.college.createMany({
    data: collegeData,
  });

  // Seed reviews
  for (const collegeReview of reviewData) {
    const college = await prisma.college.findFirst({
      where: {
        name: collegeReview.collegeName,
      },
    });

    if (!college) {
      console.log(`College not found: ${collegeReview.collegeName}`);
      continue;
    }

    await prisma.review.createMany({
      data: collegeReview.reviews.map((review) => ({
        collegeId: college.id,
        content: review.content,
        rating: review.rating,
      })),
    });
  }

  console.log("Colleges and reviews seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });