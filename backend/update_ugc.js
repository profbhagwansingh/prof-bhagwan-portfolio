const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.publication.updateMany({
    where: {
      tag: "UGC_CARE",
      year: {
        lt: 2019 // strictly less than 2019, or should it be <= 2018? Yes.
      }
    },
    data: {
      tag: "UGC_APPROVED"
    }
  });

  console.log(`Successfully updated ${result.count} publications from UGC_CARE to UGC_APPROVED`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
