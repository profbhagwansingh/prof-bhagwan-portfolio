import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@bhagwansingh.com';
  const plainPassword = 'Admin@1234';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('⚠️  Admin user already exists, skipping.');
    return;
  }

  const passwordHash = await bcrypt.hash(plainPassword, 12);

  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('📧 Email:   ', email);
  console.log('🔑 Password:', plainPassword);
  console.log('⚠️  Change this password after first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });