import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pubs = await prisma.publication.findMany();
  for (const pub of pubs) {
    if (pub.journal && pub.journal.includes(' (Vol.')) {
      const newJournal = pub.journal.split(' (Vol.')[0].trim();
      await prisma.publication.update({
        where: { id: pub.id },
        data: { journal: newJournal }
      });
      console.log(`Updated: ${pub.id} to ${newJournal}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
