import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pubs = await prisma.publication.findMany({
    select: { journal: true }
  });
  
  const smsPubs = pubs.filter(p => p.journal && p.journal.toLowerCase().includes('sms'));
  console.log(`Found ${smsPubs.length} SMS journals`);
  smsPubs.forEach(p => console.log(p.journal));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
