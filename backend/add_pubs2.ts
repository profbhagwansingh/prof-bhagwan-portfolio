import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pubs = [
    {
      title: 'Solid Waste To Theme Based Parks In Himachal Pradesh, India: A Healthy, Sustainable, Eco-friendly And Skilled Initiative For Entrepreneurs',
      authors: 'Sachin Kumar, SunitaYadav, Bhagwan Singh',
      journal: 'SMS Journal of Entrepreneurship & Innovation (Vol. V, No. 1; December-2018) ISSN 2349-7920',
      year: 2018,
      tag: 'UGC_APPROVED'
    },
    {
      title: 'Business Prospects For Entrepreneurs In Skill Based Online Education',
      authors: 'G S Rathore, Bhagwan Singh, Sachin Kumar, Rita Rai, Kamlesh Kumar',
      journal: 'SMS Journal of Entrepreneurship & Innovation (Vol. VI, No. 1; December-2019) ISSN 2349-7920',
      year: 2019,
      tag: 'PEER_REVIEWED'
    }
  ];

  for (const pub of pubs) {
    await prisma.publication.create({
      data: pub as any
    });
    console.log(`Inserted: ${pub.title}`);
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
