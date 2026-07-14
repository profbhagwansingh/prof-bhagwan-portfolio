const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const p = new PrismaClient();

async function main() {
  const data = {
    galleryCategories: await p.galleryCategory.findMany(),
    galleryItems: await p.galleryItem.findMany(),
    publications: await p.publication.findMany(),
    books: await p.book.findMany(),
    achievements: await p.achievement.findMany(),
    courses: await p.course.findMany(),
    heroSections: await p.heroSection.findMany(),
    aboutContent: await p.aboutContent.findMany(),
    timeline: await p.experienceTimeline.findMany(),
    scholars: await p.phdScholar.findMany(),
    announcements: await p.announcement.findMany(),
    socialLinks: await p.socialLink.findMany(),
    settings: await p.siteSetting.findMany(),
    seoMetadata: await p.seoMetadata.findMany(),
  };
  fs.writeFileSync('local-data.json', JSON.stringify(data, null, 2));
  console.log('✅ Data exported to local-data.json');
}

main().catch(console.error).finally(() => p.$disconnect());