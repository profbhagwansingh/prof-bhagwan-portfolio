const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// It will automatically use the DATABASE_URL from your .env file
const p = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('local-data.json', 'utf8'));

  for (const cat of data.galleryCategories) await p.galleryCategory.upsert({ where: { id: cat.id }, update: cat, create: cat });
  for (const item of data.galleryItems) await p.galleryItem.upsert({ where: { id: item.id }, update: item, create: item });
  for (const pub of data.publications) await p.publication.upsert({ where: { id: pub.id }, update: pub, create: pub });
  for (const book of data.books) await p.book.upsert({ where: { id: book.id }, update: book, create: book });
  for (const a of data.achievements) await p.achievement.upsert({ where: { id: a.id }, update: a, create: a });
  for (const c of data.courses) await p.course.upsert({ where: { id: c.id }, update: c, create: c });
  for (const h of data.heroSections) await p.heroSection.upsert({ where: { id: h.id }, update: h, create: h });
  for (const ab of data.aboutContent) await p.aboutContent.upsert({ where: { id: ab.id }, update: ab, create: ab });
  for (const t of data.timeline) await p.experienceTimeline.upsert({ where: { id: t.id }, update: t, create: t });
  for (const s of data.scholars) await p.phdScholar.upsert({ where: { id: s.id }, update: s, create: s });
  for (const an of data.announcements) await p.announcement.upsert({ where: { id: an.id }, update: an, create: an });
  for (const sl of data.socialLinks) await p.socialLink.upsert({ where: { id: sl.id }, update: sl, create: sl });
  for (const st of data.settings) await p.siteSetting.upsert({ where: { id: st.id }, update: st, create: st });
  for (const seo of data.seoMetadata) await p.seoMetadata.upsert({ where: { id: seo.id }, update: seo, create: seo });

  console.log('✅ All data imported to Render database!');
}

main().catch(console.error).finally(() => p.$disconnect());