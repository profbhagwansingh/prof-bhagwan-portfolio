const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const courses = [
  { name: "Strategic Management", url: "/media/Courses Taught/Strategic Management.pdf" },
  { name: "Marketing Management", url: "/media/Courses Taught/Marketing Management.pdf" },
  { name: "Basics of Computers & MIS", url: "/media/Courses Taught/Basic of Computers.pdf" },
  { name: "Business Environment", url: "/media/Courses Taught/Business Envt.pdf" },
  { name: "Consumer Behaviour", url: "/media/Courses Taught/Consumer behaviour.pdf" },
  { name: "Digital Social Media & Marketing", url: "/media/Courses Taught/Digital Social Media Marketing.pdf" },
  { name: "Web Based Advertising", url: "/media/Courses Taught/Web Based Advertising.pdf" },
  { name: "Mobile Based Advertising", url: "/media/Courses Taught/MSC 439  Mobile Based Marketing MBM Jan July 2019.pdf" },
  { name: "Internet Based Marketing", url: "/media/Courses Taught/MSC 520  Internet Based Marketing IBM Aug - Dec 2017.pdf" },
  { name: "Retail Management", url: "/media/Courses Taught/MSC 403_Retail Marketing.pdf" },
  { name: "Green Marketing", url: "/media/Courses Taught/MSC 430 Digital Marketing SD - 4 Syllabus 2016.pdf" },
  { name: "Advertising & Brand Management", url: "/media/Courses Taught/MSC 510 Advertising Research Syllabus.pdf" },
  { name: "Integrated Marketing Communication", url: "/media/Courses Taught/Dr B singh MSC 405 IMC Integrated Marketing Communication 2014 with Lecture Plan.pdf" },
  { name: "Marketing Research", url: "/media/Courses Taught/Dr B singh MSC 502_Marketing Research with Lecutre Plan.pdf" },
  { name: "Strategic Marketing", url: "/media/Courses Taught/Strategic Management.pdf" },
  { name: "E-Customer Relationship Management (CRM)", url: "/media/Courses Taught/Dr B singh MSC 504 2013 Internet Marketing.pdf" },
  { name: "Entrepreneurship", url: "/media/Courses Taught/MSC 439  Mobile Based Marketing MBM Jan July 2019.pdf" },
  { name: "Creativity & Brand Awareness", url: "/media/Courses Taught/Digital Social Media Marketing.pdf" },
  { name: "Research & Publication Ethics", url: "/media/Courses Taught/Research Publication Ethics RPE Syllabus by UGC.pdf" },
  { name: "Academic Writing & Communication Skill", url: "/media/Courses Taught/CSR Computer Skills for Research PhD Course work Syllabus.pdf" },
  { name: "Advance Topics on Strategic Marketing", url: "/media/Courses Taught/MSC 607 PhD Advance Topics in Strategic Marketing & Management Syllabus 2019.pdf" }
];

async function main() {
  console.log('Seeding courses with syllabus URLs...');
  await prisma.course.deleteMany({});
  for (let i = 0; i < courses.length; i++) {
    await prisma.course.create({
      data: {
        name: courses[i].name,
        category: "Management", // Default category
        syllabusUrl: courses[i].url,
        isActive: true,
        sortOrder: i + 1
      }
    });
  }
  console.log(`Successfully added ${courses.length} courses with syllabus URLs!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
