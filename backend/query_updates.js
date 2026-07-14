const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetDate = new Date('2026-07-11T16:30:00+05:30');
  console.log('Querying updates before:', targetDate.toLocaleString());

  const auditLogs = await prisma.auditLog.findMany({
    where: {
      createdAt: {
        lte: targetDate
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  if (auditLogs.length > 0) {
    console.log('\n--- AUDIT LOGS ---');
    console.table(auditLogs.map(l => ({
      Action: l.action,
      Entity: l.entityType,
      Date: l.createdAt.toLocaleString(),
    })));
  } else {
    console.log('No audit logs found. Checking entity updatedAt fields instead...');
    
    // Check SEO metadata as it has updatedAt
    const seo = await prisma.seoMetadata.findMany({
      where: { updatedAt: { lte: targetDate } },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });
    
    if (seo.length > 0) {
      console.log('\n--- SEO SETTINGS UPDATES ---');
      console.table(seo.map(s => ({ Page: s.pageSlug, UpdatedAt: s.updatedAt.toLocaleString() })));
    }
    
    // Check invited lectures (has createdAt)
    const lectures = await prisma.invitedLecture.findMany({
      where: { createdAt: { lte: targetDate } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    if (lectures.length > 0) {
      console.log('\n--- LECTURES ADDED ---');
      console.table(lectures.map(l => ({ Title: l.title.substring(0, 30) + '...', CreatedAt: l.createdAt.toLocaleString() })));
    }

    // Check Publications (has createdAt)
    const pubs = await prisma.publication.findMany({
      where: { createdAt: { lte: targetDate } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    if (pubs.length > 0) {
      console.log('\n--- PUBLICATIONS ADDED ---');
      console.table(pubs.map(p => ({ Title: p.title.substring(0, 30) + '...', CreatedAt: p.createdAt.toLocaleString() })));
    }
  }
}

main().catch(console.error).finally(() => prisma['$disconnect']());
