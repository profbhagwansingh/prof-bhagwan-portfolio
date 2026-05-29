import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@bhagwansingh.com';
  const plainPassword = 'adminpassword123';

  // Hash password
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });
    console.log(`✅ Admin user ${email} password reset successfully!`);
  } else {
    // Create super admin
    await prisma.user.create({
      data: {
        email,
        fullName: 'Super Admin',
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log('✅ Super Admin created successfully!');
  }

  console.log('──────────────────────────────────────');
  console.log(`Email:    ${email}`);
  console.log(`Password: ${plainPassword}`);
  console.log('──────────────────────────────────────');
  console.log('Please log in and change this password immediately.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
