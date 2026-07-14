const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Real professional timeline from the old website (olds/about.html)
const timelineData = [
  {
    title: "Professor of Management",
    organization: "Department of Business Administration (DBA), School of Management Sciences (SMS), Central University of Jharkhand (CUJ)",
    location: "Ranchi, Jharkhand",
    dateRange: "March 2020 - Present",
    externalLink: "https://cuj.ac.in/DOBA/Bhagwan_singh.php",
    subtitle: null,
    isActive: true,
    sortOrder: 1
  },
  {
    title: "Dean & Head",
    organization: "Department of Business Administration (DBA), School of Management Sciences (SMS), Central University of Jharkhand (CUJ)",
    location: "Ranchi, Jharkhand",
    dateRange: "Nov 2020 - Jan 2024",
    subtitle: "Additional Administrative Responsibility",
    isActive: true,
    sortOrder: 2
  },
  {
    title: "Finance Officer (I/c)",
    organization: "Central University of Jharkhand (CUJ)",
    location: "Ranchi, Jharkhand",
    dateRange: "July 2020 - Nov 2020",
    subtitle: "Additional Administrative Responsibility",
    isActive: true,
    sortOrder: 3
  },
  {
    title: "Founder Dean & Associate Professor",
    organization: "School of Commerce and Management Studies, Central University of Himachal Pradesh (CUHP)",
    location: "Dharamshala, Himachal Pradesh",
    dateRange: "March 2012 - March 2020",
    subtitle: null,
    isActive: true,
    sortOrder: 4
  },
  {
    title: "Assistant Professor",
    organization: "RSMT, Udai Pratap Autonomous College",
    location: "Varanasi, Uttar Pradesh",
    dateRange: "October 2005 - March 2012",
    subtitle: null,
    isActive: true,
    sortOrder: 5
  },
  {
    title: "Lecturer and Administrator",
    organization: "In Reputed Organizations",
    location: null,
    dateRange: "Before October 2005",
    subtitle: null,
    isActive: true,
    sortOrder: 6
  }
];

async function main() {
  console.log('Seeding professional timeline...');
  
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
