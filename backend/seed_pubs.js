const { PrismaClient } = require('@prisma/client');
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')) {
  console.error('❌ BLOCKED: This seed script would delete production data! Exiting.');
  process.exit(1);
}
const prisma = new PrismaClient();

const publications = [
  {
    title: "India-foreign migration for job: an opinion of professional skilled youths of India",
    journal: "International Journal of Public Sector Performance Management",
    tag: "PEER_REVIEWED",
    year: 2026,
    authors: "Bhagwan Singh, Sachin Kumar & Sunita Yadav",
    doi: "10.1504/IJPSPM.2026.151447",
    sortOrder: 1
  },
  {
    title: "The primacy of content quality: a review of Factors influencing consumer perception And intention towards OTT platforms",
    journal: "TPM",
    tag: "PEER_REVIEWED",
    year: 2025,
    authors: "Amitabh Avinash & Bhagwan Singh",
    externalUrl: "https://www.tpmap.org/",
    sortOrder: 2
  },
  {
    title: "Taking flight with food: investigating the determinants of user acceptance toward drone-based food delivery services in India",
    journal: "British Food Journal (Emerald Publishing Limited)",
    tag: "SCOPUS",
    year: 2024,
    sortOrder: 3
  },
  {
    title: "Drone Usage opportunities for Entrepreneur Contributing towards Aatmanirbhar Bharat",
    journal: "SMS Journal of Entrepreneurship & Innovations, Refereed Journal",
    tag: "PEER_REVIEWED",
    year: 2023,
    sortOrder: 2
  },
  {
    title: "Metaverse the Next Renaissance of Financial Inclusion: Scientific Mapping & Future Research Directions.",
    journal: "Journal of Content, Community & Communication",
    tag: "SCOPUS",
    year: 2023,
    sortOrder: 3
  },
  {
    title: "A study of Prospects and Problems of Online Education in Bihar",
    journal: "Global Journal of Enterprise Information System",
    tag: "UGC_CARE",
    year: 2023,
    sortOrder: 4
  },
  {
    title: "Role of Kisan Drone in developing agricultural Production as a tool of Drone Delivery Service (DDS)",
    journal: "Education and Society",
    tag: "UGC_CARE",
    year: 2023,
    sortOrder: 5
  },
  {
    title: "Drone Delivery Services Adaptation Among Consumers of India",
    journal: "Indian Journal of Commerce Association",
    tag: "UGC_CARE",
    year: 2022,
    sortOrder: 6
  },
  {
    title: "Towards green product consumption: Effect of green marketing stimuli and perceived environmental knowledge in Indian consumer market",
    journal: "Society and Business Review",
    tag: "SCOPUS",
    year: 2021,
    sortOrder: 7
  },
  {
    title: "CRISP Model: A Structured Approach for Presentation of Research",
    journal: "CSI Communications",
    tag: "PEER_REVIEWED",
    year: 2018,
    sortOrder: 8
  },
  {
    title: "Toward sustainable consumption: Investigating the determinants of green buying behaviour of Indian consumers.",
    journal: "Business Strategy& Development by John Wiley &Sons Ltd and ERP Environment",
    tag: "SCOPUS",
    year: 2018,
    sortOrder: 9
  },
  {
    title: "Solid Waste to Theme Based Parks In Himachal Pradesh, India: A Healthy, Sustainable, Eco-Friendly and Skilled Initiative for Entrepreneurs",
    journal: "SMS Journal of Entrepreneurship & Innovations, Refereed Journal",
    tag: "PEER_REVIEWED",
    year: 2018,
    sortOrder: 10
  },
  {
    title: "Opportunities for Entrepreneur in Municipal Solid Waste Management in Smart City Dharamshala, Himachal Pradesh",
    journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal",
    tag: "PEER_REVIEWED",
    year: 2018,
    sortOrder: 11
  },
  {
    title: "Flourishing Demand for shopping websites as an opportunity for forthcoming Entrepreneurs",
    journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal",
    tag: "UGC_CARE",
    year: 2017,
    sortOrder: 12
  },
  {
    title: "Mobile Marketing: Upcoming marketing tool for Entrepreneurs",
    journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal",
    tag: "UGC_CARE",
    year: 2017,
    sortOrder: 13
  },
  {
    title: "Usage of Web Based Advertising (WBA)",
    journal: "Arni University International Journal",
    tag: "PEER_REVIEWED",
    year: 2016,
    sortOrder: 14
  },
  {
    title: "Green Marketing: A Marketing Framework of STP towards Eco- Advantage",
    journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal",
    tag: "UGC_CARE",
    year: 2016,
    sortOrder: 15
  },
  {
    title: "Analysis of Eco-Labels for Green Washing In North Indian States",
    journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal",
    tag: "UGC_CARE",
    year: 2016,
    sortOrder: 16
  },
  {
    title: "Marketing Management: WBA is upcoming revolution in Advertising Thought and Strategy",
    journal: "International Journal of Economics & Managerial Thoughts",
    tag: "PEER_REVIEWED",
    year: 2015,
    sortOrder: 17
  },
  {
    title: "A Study on Current Status of Green Marketing in North India",
    journal: "Pacific Business Review",
    tag: "SCOPUS",
    year: 2015,
    sortOrder: 18
  },
  {
    title: "A Study of the Prospects and Problems of Web Based Advertising (WBA) in Eastern U. P.",
    journal: "Global Journal of Enterprise Information System",
    tag: "UGC_CARE",
    year: 2015,
    sortOrder: 19
  },
  {
    title: "Consumer Preference for Eco- Friendly Products of Home Appliance Companies",
    journal: "Indian Journal of Commerce Association",
    tag: "UGC_CARE",
    year: 2014,
    sortOrder: 20
  },
  {
    title: "An Empirical Investigation of Financial Performance of Nationalised Banks in India",
    journal: "International Journal of Economics & Managerial Thoughts",
    tag: "PEER_REVIEWED",
    year: 2014,
    sortOrder: 21
  },
  {
    title: "Women Entrepreneurship developing platform by WBA",
    journal: "SMS Journal of Entrepreneurship & Innovations, Refereed Journal",
    tag: "UGC_CARE",
    year: 2014,
    sortOrder: 22
  },
  {
    title: "Customer Satisfaction Analysis on Services of Delhi Metro",
    journal: "Asian Journal of Multidisciplinary Studies (AJMS)",
    tag: "SCOPUS",
    year: 2014,
    sortOrder: 23
  },
  {
    title: "Factors affecting Green Buying Behaviour (GBB) of Consumers",
    journal: "Commerce Spectrum (International Journal of Commerce &Business Studies)",
    tag: "UGC_CARE",
    year: 2013,
    sortOrder: 24
  },
  {
    title: "Opportunity for Women Entrepreneurs to en-cash Virtual World through WBA",
    journal: "International Journal of Economics & Managerial Thoughts",
    tag: "PEER_REVIEWED",
    year: 2013,
    sortOrder: 25
  },
  {
    title: "Ledge of IT Jobs & HRM in E-Commerce in Eastern U. P",
    journal: "International Journal of Commerce & Social Sciences",
    tag: "PEER_REVIEWED",
    year: 2011,
    sortOrder: 26
  },
  {
    title: "Prospects of Web Based Advertising",
    journal: "Indian Journal of Commerce Association",
    tag: "PEER_REVIEWED",
    year: 2010,
    sortOrder: 27
  },
  {
    title: "Online Advertising: Trends, Issues and Ideas",
    journal: "Aatmbodh, Journal",
    tag: "PEER_REVIEWED",
    year: 2009,
    sortOrder: 28
  }
];

async function main() {
  console.log("Deleting existing publications...");
  await prisma.publication.deleteMany({});
  
  console.log("Inserting new publications...");
  for (const pub of publications) {
    await prisma.publication.create({
      data: pub
    });
  }
  
  console.log("Successfully seeded publications!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
