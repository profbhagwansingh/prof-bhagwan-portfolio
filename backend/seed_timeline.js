const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const timelineData = [
  {
    title: "Professor of Management",
    organization: "Department of Business Administration (DBA), School of Management Sciences (SMS), Central University of Jharkhand (CUJ), Ranchi, JH",
    dateRange: "March 2020 - till date",
    subtitle: "Additional Responsibilities:\n- Dean & Head (Nov 2020 - Jan 2024)\n- Finance Officer I/c (July 2020 - Nov 2020)",
    isActive: true,
    sortOrder: 1
  },
  {
    title: "Founder Dean & Associate Professor",
    organization: "School of Commerce and Management Studies, Central University of Himachal Pradesh (CUHP), Dharamshala, H. P.",
    dateRange: "March 2012 - March 2020",
    subtitle: "",
    isActive: true,
    sortOrder: 2
  },
  {
    title: "Assistant Professor",
    organization: "RSMT, Udai Pratap Autonomous College, Varanasi, Uttar Pradesh",
    dateRange: "October 2005 - March 2012",
    subtitle: "",
    isActive: true,
    sortOrder: 3
  },
  {
    title: "Lecturer and Administrator",
    organization: "In Reputed Organizations",
    dateRange: "Experiences before October 2005",
    subtitle: "",
    isActive: true,
    sortOrder: 4
  }
];

async function main() {
  console.log('Seeding academic timeline...');
  
  // Clear existing
  await prisma.experienceTimeline.deleteMany({});
  
  let count = 0;
  for (const item of timelineData) {
    await prisma.experienceTimeline.create({
      data: item
    });
    count++;
  }
  
  console.log(`Successfully added ${count} timeline entries!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
