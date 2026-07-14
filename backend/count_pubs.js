const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countPubs() {
  const count = await prisma.publication.count();
  console.log('Total publications in database:', count);
}

countPubs().catch(console.error).finally(() => prisma.$disconnect());
