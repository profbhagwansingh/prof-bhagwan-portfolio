const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@profbhagwan.com' } });
  if (user) {
    const match1 = await bcrypt.compare('adminpassword123', user.passwordHash);
    const match2 = await bcrypt.compare('Admin@123456', user.passwordHash);
    console.log('Matches adminpassword123?', match1);
    console.log('Matches Admin@123456?', match2);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
