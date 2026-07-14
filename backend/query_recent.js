const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const startDate = new Date('2026-07-10T00:00:00Z');
  const endDate = new Date('2026-07-12T23:59:59Z');
  
  async function checkCreatedAt(modelName, model) {
    try {
      const results = await model.findMany({ where: { createdAt: { gte: startDate, lte: endDate } } });
      if (results.length > 0) {
        console.log(`\n${modelName} added:`, results.length);
        results.slice(0, 3).forEach(r => console.log('  -', r.createdAt.toLocaleString(), '-', (r.title || r.name || r.id)));
      }
    } catch (e) {}
  }

  const models = [
    { name: 'HeroSection', model: prisma.heroSection },
    { name: 'AboutContent', model: prisma.aboutContent },
    { name: 'ExperienceTimeline', model: prisma.experienceTimeline },
    { name: 'Course', model: prisma.course },
    { name: 'Publication', model: prisma.publication },
    { name: 'Book', model: prisma.book },
    { name: 'InvitedLecture', model: prisma.invitedLecture },
    { name: 'Achievement', model: prisma.achievement },
    { name: 'PhdScholar', model: prisma.phdScholar },
    { name: 'GalleryCategory', model: prisma.galleryCategory },
    { name: 'User', model: prisma.user },
  ];

  for (const m of models) {
    await checkCreatedAt(m.name, m.model);
  }
}

main().catch(console.error).finally(() => prisma['$disconnect']());
