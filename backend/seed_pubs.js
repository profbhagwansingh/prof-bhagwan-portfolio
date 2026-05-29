const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const publications = [
  { tag: "SCOPUS",        year: 2023, title: "Impact of Digital Marketing on Consumer Purchase Behaviour in Emerging Markets",                   journal: "Journal of Marketing Research" },
  { tag: "PEER_REVIEWED", year: 2023, title: "Corporate Social Responsibility and Firm Value: Evidence from Indian Manufacturing",               journal: "Indian Journal of Corporate Governance" },
  { tag: "SCOPUS",        year: 2022, title: "Sustainable HRM Practices and Organisational Performance: A Systematic Review",                    journal: "International Journal of Human Resource Management" },
  { tag: "UGC_CARE",      year: 2022, title: "Entrepreneurship Ecosystem in India: Challenges and Opportunities Post-Pandemic",                  journal: "Journal of Entrepreneurship & Innovation" },
  { tag: "PEER_REVIEWED", year: 2022, title: "Leadership Styles and Employee Engagement in Higher Education Institutions",                       journal: "Management & Labour Studies" },
  { tag: "CONFERENCE",    year: 2022, title: "Digital Transformation in SMEs: A Framework for Strategic Adoption",                              journal: "International Conference on Business Strategy" },
  { tag: "SCOPUS",        year: 2021, title: "Green Marketing Strategies and Consumer Perception: A Study of FMCG Sector",                      journal: "Journal of Consumer Marketing" },
  { tag: "UGC_CARE",      year: 2021, title: "Work-Life Balance and Organisational Commitment Among Faculty Members",                           journal: "Indian Journal of Industrial Relations" },
  { tag: "PEER_REVIEWED", year: 2021, title: "Corporate Governance and Financial Performance: Evidence from BSE Listed Companies",              journal: "Finance India" },
  { tag: "SCOPUS",        year: 2020, title: "Knowledge Management and Competitive Advantage in Service Sector Firms",                          journal: "Journal of Knowledge Management" },
  { tag: "UGC_CARE",      year: 2020, title: "E-Commerce Adoption Barriers in Rural India: An Empirical Analysis",                             journal: "Asian Journal of Management" },
  { tag: "CONFERENCE",    year: 2020, title: "Sustainability Reporting Practices in Indian Corporations: A Content Analysis",                   journal: "National Conference on Sustainable Business" },
];

const books = [
  {
    title: "Strategic Management: Theory & Practice",
    year: 2022,
    subtitle: "A comprehensive guide for management students and practitioners.",
    isbn: "978-XXXXXXXXXX",
    coverImageUrl: "from-primary-500 to-primary-700",
  },
  {
    title: "Marketing Management in the Digital Age",
    year: 2021,
    subtitle: "Bridging traditional marketing principles with modern digital strategies.",
    isbn: "978-XXXXXXXXXX",
    coverImageUrl: "from-emerald-500 to-emerald-700",
  },
  {
    title: "Human Resource Management: A Values Approach",
    year: 2020,
    subtitle: "People-centric HRM practices for sustainable organisational growth.",
    isbn: "978-XXXXXXXXXX",
    coverImageUrl: "from-amber-500 to-amber-700",
  },
  {
    title: "Research Methodology for Management Studies",
    year: 2019,
    subtitle: "A practical guide to qualitative and quantitative research methods.",
    isbn: "978-XXXXXXXXXX",
    coverImageUrl: "from-rose-500 to-rose-700",
  },
];

async function main() {
    console.log("Seeding publications...");
    for (const pub of publications) {
        await prisma.publication.create({
            data: {
                title: pub.title,
                year: pub.year,
                journal: pub.journal,
                tag: pub.tag,
                authors: "Prof. (Dr.) Bhagwan Singh",
                isActive: true
            }
        });
    }

    console.log("Seeding books...");
    for (const book of books) {
        await prisma.book.create({
            data: {
                title: book.title,
                year: book.year,
                subtitle: book.subtitle,
                isbn: book.isbn,
                coverImageUrl: book.coverImageUrl,
                isActive: true
            }
        });
    }

    console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
