const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pubs = await prisma.publication.findMany({
    where: {
      title: {
        contains: "Opportunity for Women Entrepreneurs to en-cash Virtual World"
      }
    }
  });

  if (pubs.length === 0) {
    console.log("Publication not found!");
    return;
  }

  const pub = pubs[0];
  console.log("Found:", pub.title);

  await prisma.publication.update({
    where: { id: pub.id },
    data: {
      title: "Opportunity For Women Entrepreneurs To Encash Virtual World Through Web Based Advertising (wba)",
      journal: "SMS Journal of Entrepreneurship & Innovation",
      year: 2015,
      authors: "Dr. Bhagwan Singh"
    }
  });

  console.log("Publication updated successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
