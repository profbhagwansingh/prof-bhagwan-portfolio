const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const startDate = new Date('2026-07-11T00:00:00+05:30');
  const endDate = new Date('2026-07-11T16:30:00+05:30');
  console.log('Querying updates between:', startDate.toLocaleString(), 'and', endDate.toLocaleString());

  // Helper to safely count createdAt
  async function checkCreatedAt(modelName, model) {
    try {
      const results = await model.findMany({ where: { createdAt: { gte: startDate, lte: endDate } } });
      if (results.length > 0) console.log(`\n${modelName} added/updated:`, results.length);
    } catch (e) {
      // Model might not have createdAt, skip
    }
  }
  
  // Helper to safely count updatedAt
  async function checkUpdatedAt(modelName, model) {
    try {
      const results = await model.findMany({ where: { updatedAt: { gte: startDate, lte: endDate } } });
      if (results.length > 0) console.log(`\n${modelName} updated:`, results.length);
    } catch (e) {
      // Model might not have updatedAt, skip
    }
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
    { name: 'SiteSetting', model: prisma.siteSetting },
  ];

  for (const m of models) {
    await checkCreatedAt(m.name, m.model);
    await checkUpdatedAt(m.name, m.model);
  }

  console.log('Query complete.');
}

main().catch(console.error).finally(() => prisma['$disconnect']());
