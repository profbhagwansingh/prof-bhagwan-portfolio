const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const courses = await p.course.findMany();
  
  for (const course of courses) {
    if (course.syllabusUrl && course.syllabusUrl.includes('/media/Courses Taught/')) {
      // Extract just the filename from the old path
      const filename = course.syllabusUrl.replace('/media/Courses Taught/', '');
      const newUrl = '/media/courses/' + filename;
      
      await p.course.update({
        where: { id: course.id },
        data: { syllabusUrl: newUrl }
      });
      
      console.log('Updated: ' + course.name + ' -> ' + newUrl);
    } else {
      console.log('Skipped: ' + course.name + ' (no old URL)');
    }
  }
  
  console.log('\nDone! All course URLs updated.');
}

main().catch(console.error).finally(() => p['$disconnect']());
