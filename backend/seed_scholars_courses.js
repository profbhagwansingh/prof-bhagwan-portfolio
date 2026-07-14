const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const courses = [
  "Strategic Management", "Marketing Management", "Basics of Computers & MIS",
  "Business Environment", "Consumer Behaviour", "Digital Social Media & Marketing",
  "Web Based Advertising", "Mobile Based Advertising", "Internet Based Marketing",
  "Retail Management", "Green Marketing", "Advertising & Brand Management",
  "Integrated Marketing Communication", "Marketing Research", "Strategic Marketing",
  "E-Customer Relationship Management (CRM)", "Entrepreneurship", "Creativity & Brand Awareness",
  "Research & Publication Ethics", "Academic Writing & Communication Skill",
  "Advance Topics on Strategic Marketing"
];

const scholars = [
  { name: "Dr. Sachin Kumar", status: "POST_DOC", topic: "Green Marketing (Post-Doctoral)", imageUrl: "/media/img/research-scholars/sachine.png" },
  { name: "Dr. Rishi Kant", status: "AWARDED", topic: "Management", imageUrl: "/media/img/research-scholars/rishi.png" },
  { name: "Dr. Devender Kumar", status: "AWARDED", topic: "Management", imageUrl: "/media/img/research-scholars/devender.png" },
  { name: "Dr. Deepak Jaiswal", status: "AWARDED", topic: "Management", imageUrl: "/media/img/research-scholars/deepak.png" },
  { name: "Dr. Kamlesh Kumar", status: "AWARDED", topic: "Management", imageUrl: "/media/img/research-scholars/kamlesh.png" },
  { name: "Ajit Kumar Das", status: "PURSUING", topic: "Management", imageUrl: "/media/img/research-scholars/ajit kumar.png" },
  { name: "Amitabh Avinash", status: "PURSUING", topic: "Management", imageUrl: "/media/img/research-scholars/amitabh.png" },
  { name: "Hemant Raj", status: "PURSUING", topic: "Management", imageUrl: "/media/img/research-scholars/hemat.png" },
  { name: "Dhirendra Narayan Das", status: "PURSUING", topic: "Management", imageUrl: "/media/img/research-scholars/narayan das.png" },
  { name: "Kumar Shivam", status: "PURSUING", topic: "Management", imageUrl: "/media/img/research-scholars/kumar.png" },
  { name: "Anil Topo", status: "PURSUING", topic: "Management", imageUrl: "/media/img/research-scholars/anil.jpg" },
  { name: "Rupesh Kumar Meheto", status: "PURSUING", topic: "Management", imageUrl: "/media/img/research-scholars/rupesh.jpg" },
];

async function main() {
  console.log('Seeding courses...');
  await prisma.course.deleteMany({});
  for (let i = 0; i < courses.length; i++) {
    await prisma.course.create({
      data: {
        name: courses[i],
        category: "Management", // Default category
        isActive: true,
        sortOrder: i + 1
      }
    });
  }
  console.log(`Successfully added ${courses.length} courses!`);

  console.log('Seeding scholars...');
  await prisma.phdScholar.deleteMany({});
  for (let i = 0; i < scholars.length; i++) {
    await prisma.phdScholar.create({
      data: {
        name: scholars[i].name,
        researchTopic: scholars[i].topic,
        status: scholars[i].status,
        imageUrl: scholars[i].imageUrl,
        isActive: true,
        sortOrder: i + 1
      }
    });
  }
  console.log(`Successfully added ${scholars.length} scholars!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
