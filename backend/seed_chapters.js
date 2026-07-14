const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const chaptersData = [
  { sl: 1, title: "NEP-2020: Challenge On Implementation", isbn: "978-1-63640-008-2", authors: "Single Author", publisher: "White Falcon Publishing", year: 2020 },
  { sl: 2, title: "Prospects for Entrepreneurs in Retail Outlets in H. P", isbn: "978-93- 86142-23-8", authors: "First and Principal/Corresponding author", publisher: "MRI Publications", year: 2018 },
  { sl: 3, title: "Popular Websites helping Agriculture of India ICT Rural Development", isbn: "978-81- 933475-5-3", authors: "Single Author", publisher: "Bharti Publications, New Delhi", year: 2016 },
  { sl: 4, title: "Role of Web based Advertising (WBA) in Promotion Mix: A New Area for Strategic Management", isbn: "978-93- 85000-48-5", authors: "Single Author", publisher: "Bharti Publications, New Delhi", year: 2015 },
  { sl: 5, title: "Modern Marketing Management: Green Marketing as a Paradigm of Environmental Sustainability", isbn: "978-93- 85000-48-5", authors: "First and Principal/Corresponding author", publisher: "Bharti Publications, New Delhi", year: 2015 },
  { sl: 6, title: "Analyzing Performance of Technology in Selected Public Sector Banks: An Application in Modern E-World", isbn: "978-93- 85000-48-5", authors: "First and Principal/Corresponding author", publisher: "Bharti Publications, New Delhi", year: 2015 },
  { sl: 7, title: "Internet Usage and Modern Management of Websites", isbn: "978-93- 85000-48-5", authors: "First and Principal/Corresponding author", publisher: "Bharti Publications, New Delhi", year: 2015 },
  { sl: 8, title: "Green Marketing Through WBA in International Trade", isbn: "978-93- 81563-24-3", authors: "First and Principal/Corresponding author", publisher: "Global Publishing House, Vishakhapatnam", year: 2014 },
  { sl: 9, title: "Dimensions of Service Sector Operations and Approaches: An Assessment of Nationalized Sector Banks in India", isbn: "978-93- 8493-502-3", authors: "First and Principal/Corresponding author", publisher: "IIT Roorkee, Dept. of Management Studies", year: 2014 },
  { sl: 10, title: "Stride of Advertising: Web Based Advertising", isbn: "978-81-261- 5064-9", authors: "Single Author", publisher: "Anmol Publication, New Delhi", year: 2012 },
  { sl: 11, title: "Web Based Advertising: An increasing demand in Agribusiness with Internet World", isbn: "978-93- 81564-02-8", authors: "Single Author", publisher: "Suruchi Kala Prakashan, Varanasi", year: 2011 },
  { sl: 12, title: "Web Based Advertising: An Emerging Stride of Advertising in India – A study Based on Eastern Districts of Uttar Pradesh", isbn: "978-93- 81361-12-2", authors: "First and Principal/Corresponding author", publisher: "Excel India Publishers", year: 2011 },
  { sl: 13, title: "E-Advertising and Women Entrepreneurship: A study from Eastern U. P.", isbn: "10: 0230- 33150-1", authors: "Single Author", publisher: "Macmillian", year: 2010 },
  { sl: 14, title: "Web Based Advertisements for Retail and Indian Government Services", isbn: "978-81- 907612-6-0", authors: "Single Author", publisher: "ABC Press, New Delhi", year: 2010 },
  { sl: 15, title: "Web Based Advertising – Case Study of Varanasi Region", isbn: "978-81- 907612-1-8", authors: "First and Principal/Corresponding author", publisher: "ABC Press, New Delhi", year: 2009 }
];

async function main() {
  console.log('Seeding 15 Book Chapters...');
  
  for (const item of chaptersData) {
    await prisma.bookChapter.create({
      data: {
        slNo: item.sl,
        title: item.title,
        authors: item.authors,
        publisher: item.publisher,
        isbn: item.isbn,
        year: item.year,
        sortOrder: item.sl,
        isActive: true,
      }
    });
    process.stdout.write('.');
  }
  
  console.log('\nSuccessfully seeded 15 Book Chapters.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
