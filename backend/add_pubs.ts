import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pubs = [
    {
      title: 'Opportunity For Women Entrepreneurs To Encash Virtual World Through Web Based Advertising (wba)',
      authors: 'Dr. Bhagwan Singh',
      journal: 'SMS Journal of Entrepreneurship & Innovation (Vol. I, No. 2; June-2015) ISSN 2349-7920',
      year: 2015,
      tag: 'PEER_REVIEWED'
    },
    {
      title: 'Analysis of Eco-labels for Green Washing in North Indian States',
      authors: 'Bhagwan Singh, Sachin Kumar',
      journal: 'SMS Journal of Entrepreneurship & Innovation (Vol. II, No. 1; December-2015) ISSN 2349-7920',
      year: 2015,
      tag: 'PEER_REVIEWED'
    },
    {
      title: 'Green Marketing: A Marketing Framework of \'STP\' Towards Eco-Advantage',
      authors: 'Bhagwan Singh, Deepak Jaiswal',
      journal: 'SMS Journal of Entrepreneurship & Innovation (Vol. II, No. 2; June-2016) ISSN 2349-7920',
      year: 2016,
      tag: 'PEER_REVIEWED'
    },
    {
      title: 'Flourishing Demand for shopping websites as an opportunity for forthcoming Entrepreneurs',
      authors: 'Bhagwan Singh',
      journal: 'SMS Journal of Entrepreneurship & Innovation (Vol. IV, No. 1; December-2017) ISSN 2349-7920',
      year: 2017,
      tag: 'UGC_APPROVED'
    },
    {
      title: 'Opportunities For Entrepreneursin Household Solid Waste Management In Smart City Dharamshala, Himachal Pradesh',
      authors: 'Dr. Sachin, SunitaYadav, Dr. Bhagwan Singh',
      journal: 'SMS Journal of Entrepreneurship & Innovation (Vol. IV, No. 2; June-2018) ISSN 2349-7920',
      year: 2018,
      tag: 'UGC_APPROVED'
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
