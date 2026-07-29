const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany();
  let updated = 0;
  for (const course of courses) {
    if (course.syllabusUrl && course.syllabusUrl.includes('/media/Courses Taught/')) {
      const newUrl = course.syllabusUrl.replace('/media/Courses Taught/', '/media/courses/');
      await prisma.course.update({
        where: { id: course.id },
        data: { syllabusUrl: newUrl }
      });
      updated++;
      console.log(`Updated ${course.name}: ${newUrl}`);
    }
  }
  console.log(`Successfully updated ${updated} course URLs from 'Courses Taught' to 'courses'`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
