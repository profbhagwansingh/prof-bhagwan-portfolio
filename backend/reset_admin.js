const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@bhagwansingh.com';
  const password = 'adminpassword123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (existingAdmin) {
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword, role: 'SUPER_ADMIN' }
    });
    console.log('Admin user updated with new password and role.');
  } else {
    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName: 'Admin',
        role: 'SUPER_ADMIN'
      }
    });
    console.log('Admin user created successfully.');
  }
}

main().catch(console.error).finally(() => prisma['$disconnect']());
