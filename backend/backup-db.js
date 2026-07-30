const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const p = new PrismaClient();
const BACKUP_DIR = path.join(__dirname, 'backups');

async function main() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

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

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(BACKUP_DIR, `backup_${timestamp}.json`);
  
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`✅ Data exported to ${filename}`);

  // Keep only the last 5 backups
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
    .sort()
    .reverse();
    
  if (backups.length > 5) {
    for (let i = 5; i < backups.length; i++) {
      fs.unlinkSync(path.join(BACKUP_DIR, backups[i]));
      console.log(`🗑️ Deleted old backup: ${backups[i]}`);
    }
  }
}

main()
  .catch(e => {
    console.error('Backup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await p.$disconnect();
  });
