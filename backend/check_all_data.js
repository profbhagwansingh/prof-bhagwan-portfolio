const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const tables = [
    ['User', prisma.user.count()],
    ['Publication', prisma.publication.count()],
    ['Book', prisma.book.count()],
    ['GalleryCategory', prisma.galleryCategory.count()],
    ['GalleryItem', prisma.galleryItem.count()],
    ['ContactSubmission', prisma.contactSubmission.count()],
    ['AlumniSubmission', prisma.alumniSubmission.count()],
    ['Course', prisma.course.count()],
    ['PhdScholar', prisma.phdScholar.count()],
    ['ExperienceTimeline', prisma.experienceTimeline.count()],
    ['Achievement', prisma.achievement.count()],
    ['Announcement', prisma.announcement.count()],
    ['SocialLink', prisma.socialLink.count()],
    ['SiteSetting', prisma.siteSetting.count()],
  ];
  for (const [name, promise] of tables) {
    try { const c = await promise; console.log(`${name}: ${c} rows`); }
    catch(e) { console.log(`${name}: ERROR - ${e.message}`); }
  }
}
main().finally(() => prisma.$disconnect());
