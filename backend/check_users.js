const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.findMany({
  select: { id: true, email: true, fullName: true, role: true, isActive: true, passwordHash: true }
}).then(users => {
  console.log('Users found:', users.length);
  users.forEach(u => {
    console.log('---');
    console.log('Email:', u.email);
    console.log('Role:', u.role);
    console.log('isActive:', u.isActive);
    console.log('Hash (first 20 chars):', u.passwordHash ? u.passwordHash.substring(0, 20) + '...' : 'NULL');
  });
}).catch(e => {
  console.error('DB Error:', e.message);
}).finally(() => {
  prisma.$disconnect();
});
