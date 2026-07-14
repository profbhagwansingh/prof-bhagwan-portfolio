const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const courses = await p.course.findMany({ orderBy: { sortOrder: 'asc' } });
  courses.forEach(c => {
    console.log(c.name + ' | ' + (c.syllabusUrl || 'NO_URL'));
  });
}

main().catch(console.error).finally(() => p['$disconnect']());
