const { PrismaClient } = require('@prisma/client');
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')) {
  console.error('❌ BLOCKED: This seed script would delete production data! Exiting.');
  process.exit(1);
}
const prisma = new PrismaClient();

const rawData = [
  { sl: 1, title: "Taking flight with food: investigating the determinants of user acceptance toward drone-based food delivery services in India", journal: "British Food Journal (Emerald Publishing Limited)", type: "Scopus", year: 2024, vol: "126", page: "Issue 3", issn: "0007-070X" },
  { sl: 2, title: "Drone Usage opportunities for Entrepreneur Contributing towards Aatmanirbhar Bharat", journal: "SMS Journal of Entrepreneurship & Innovations, Refereed Journal", type: "Peer Reviewed", year: 2023, vol: "10", page: "24", issn: "2349-7920" },
  { sl: 3, title: "Metaverse the Next Renaissance of Financial Inclusion: Scientific Mapping & Future Research Directions.", journal: "Journal of Content, Community & Communication", type: "Scopus", year: 2023, vol: "17", page: "14", issn: "2456-9011" },
  { sl: 4, title: "A study of Prospects and Problems of Online Education in Bihar", journal: "Global Journal of Enterprise Information System", type: "UGC Care", year: 2023, vol: "15", page: "30", issn: "0975-1432" },
  { sl: 5, title: "Role of Kisan Drone in developing agricultural Production as a tool of Drone Delivery Service (DDS)", journal: "Education and Society", type: "UGC Care", year: 2023, vol: "2", page: "332", issn: "2278-6864" },
  { sl: 6, title: "Drone Delivery Services Adaptation Among Consumers of India", journal: "Indian Journal of Commerce Association", type: "UGC Care", year: 2022, vol: "75", page: "192", issn: "0019-512X" },
  { sl: 7, title: "Towards green product consumption: Effect of green marketing stimuli and perceived environmental knowledge in Indian consumer market", journal: "Society and Business Review", type: "Scopus", year: 2021, vol: "17", page: "45", issn: "1746-5680" },
  { sl: 8, title: "CRISP Model: A Structured Approach for Presentation of Research", journal: "CSI Communications", type: "Peer Reviewed", year: 2018, vol: "42", page: "11", issn: "0970-647X" },
  { sl: 9, title: "Toward sustainable consumption: Investigating the determinants of green buying behaviour of Indian consumers.", journal: "Business Strategy& Development by John Wiley &Sons Ltd and ERP Environment", type: "Scopus", year: 2018, vol: "1", page: "64", issn: "2572-3170" },
  { sl: 10, title: "Solid Waste to Theme Based Parks In Himachal Pradesh, India: A Healthy, Sustainable, Eco-Friendly and Skilled Initiative for Entrepreneurs", journal: "SMS Journal of Entrepreneurship & Innovations, Refereed Journal", type: "Peer Reviewed", year: 2018, vol: "2", page: "87", issn: "2349-7920" },
  { sl: 11, title: "Opportunities for Entrepreneur in Municipal Solid Waste Management in Smart City Dharamshala, Himachal Pradesh", journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal", type: "Peer Reviewed", year: 2018, vol: "1", page: "44", issn: "2349-7920" },
  { sl: 12, title: "Flourishing Demand for shopping websites as an opportunity for forthcoming Entrepreneurs", journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal", type: "UGC Care", year: 2017, vol: "2", page: "75", issn: "2349-7920" },
  { sl: 13, title: "Mobile Marketing: Upcoming marketing tool for Entrepreneurs", journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal", type: "UGC Care", year: 2017, vol: "1", page: "47", issn: "2349-7920" },
  { sl: 14, title: "Usage of Web Based Advertising (WBA)", journal: "Arni University International Journal", type: "Peer Reviewed", year: 2016, vol: "1", page: "183", issn: "2270-4241" },
  { sl: 15, title: "Green Marketing: A Marketing Framework of STP towards Eco- Advantage", journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal", type: "UGC Care", year: 2016, vol: "2", page: "22", issn: "2349-7920" },
  { sl: 16, title: "Analysis of Eco-Labels for Green Washing In North Indian States", journal: "SMS Journal of Entrepreneurship &Innovations, Refereed Journal", type: "UGC Care", year: 2016, vol: "1", page: "23", issn: "2349-7920" },
  { sl: 17, title: "Marketing Management: WBA is upcoming revolution in Advertising Thought and Strategy", journal: "International Journal of Economics & Managerial Thoughts", type: "Peer Reviewed", year: 2015, vol: "5", page: "8", issn: "2229-3736" },
  { sl: 18, title: "A Study on Current Status of Green Marketing in North India", journal: "Pacific Business Review", type: "Scopus", year: 2015, vol: "7", page: "16", issn: "0974-438X" },
  { sl: 19, title: "A Study of the Prospects and Problems of Web Based Advertising (WBA) in Eastern U. P.", journal: "Global Journal of Enterprise Information System", type: "UGC Care", year: 2015, vol: "7", page: "131", issn: "0975-1432" },
  { sl: 20, title: "Consumer Preference for Eco- Friendly Products of Home Appliance Companies", journal: "Indian Journal of Commerce Association", type: "UGC Care", year: 2014, vol: "67", page: "76", issn: "0019-512X" },
  { sl: 21, title: "An Empirical Investigation of Financial Performance of Nationalised Banks in India", journal: "International Journal of Economics & Managerial Thoughts", type: "Peer Reviewed", year: 2014, vol: "2", page: "9", issn: "2229-3736" },
  { sl: 22, title: "Women Entrepreneurship developing platform by WBA", journal: "SMS Journal of Entrepreneurship & Innovations, Refereed Journal", type: "UGC Care", year: 2014, vol: "1", page: "94", issn: "2349-7920" },
  { sl: 23, title: "Customer Satisfaction Analysis on Services of Delhi Metro", journal: "Asian Journal of Multidisciplinary Studies (AJMS)", type: "Scopus", year: 2014, vol: "2", page: "124", issn: "2321-8819" },
  { sl: 24, title: "Factors affecting Green Buying Behaviour (GBB) of Consumers", journal: "Commerce Spectrum (International Journal of Commerce &Business Studies)", type: "UGC Care", year: 2013, vol: "3", page: "69", issn: "2249-992X" },
  { sl: 25, title: "Opportunity for Women Entrepreneurs to en-cash Virtual World through WBA", journal: "International Journal of Economics & Managerial Thoughts", type: "Peer Reviewed", year: 2013, vol: "2", page: "8", issn: "2229-3736" },
  { sl: 26, title: "Ledge of IT Jobs & HRM in E-Commerce in Eastern U. P", journal: "International Journal of Commerce & Social Sciences", type: "Peer Reviewed", year: 2011, vol: "1", page: "100", issn: "2231-5888" },
  { sl: 27, title: "Prospects of Web Based Advertising", journal: "Indian Journal of Commerce Association", type: "Peer Reviewed", year: 2010, vol: "63", page: "76", issn: "0019-512X" },
  { sl: 28, title: "Online Advertising: Trends, Issues and Ideas", journal: "Aatmbodh, Journal", type: "Peer Reviewed", year: 2009, vol: "6", page: "70", issn: "0972-1398" }
];

function mapTag(typeStr) {
  if (!typeStr) return 'PEER_REVIEWED';
  const str = typeStr.toLowerCase();
  if (str.includes('scopus')) return 'SCOPUS';
  if (str.includes('ugc care')) return 'UGC_CARE';
  if (str.includes('ugc approved')) return 'UGC_APPROVED';
  if (str.includes('peer')) return 'PEER_REVIEWED';
  if (str.includes('conference')) return 'CONFERENCE';
  return 'PEER_REVIEWED';
}

async function main() {
  console.log('Clearing old publications...');
  await prisma.publication.deleteMany();

  console.log('Seeding 28 research publications...');
  
  for (const item of rawData) {
    const journalStr = `${item.journal} | Vol: ${item.vol} | Page: ${item.page} | ISSN: ${item.issn}`;
    
    await prisma.publication.create({
      data: {
        title: item.title,
        journal: journalStr,
        tag: mapTag(item.type),
        year: item.year,
        sortOrder: item.sl,
        isActive: true,
      }
    });
    process.stdout.write('.');
  }
  
  console.log('\nSuccessfully seeded 28 publications.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
