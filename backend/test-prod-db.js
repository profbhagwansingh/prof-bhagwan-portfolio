const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://profbhagwan_db_user:HlMAPtcAmgY8M8mKOOMmnBWA8H6zCMRR@dpg-d998mgjtqb8s73a9pur0-a.singapore-postgres.render.com/profbhagwan_db?sslmode=require"
    }
  }
});

async function main() {
  try {
    console.log("Connecting to production database...");
    
    // Check if tables have data
    const pubCount = await prisma.publication.count().catch(() => -1);
    const galleryCount = await prisma.galleryItem.count().catch(() => -1);
    const userCount = await prisma.user.count().catch(() => -1);
    const contactCount = await prisma.contactSubmission.count().catch(() => -1);

    console.log("--- Database Report ---");
    console.log(`Publications: ${pubCount}`);
    console.log(`Gallery Items: ${galleryCount}`);
    console.log(`Users (Admin): ${userCount}`);
    console.log(`Contact Submissions: ${contactCount}`);
    
    if (pubCount === 0 && galleryCount === 0 && userCount === 0) {
      console.log("DATABASE IS EMPTY.");
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
