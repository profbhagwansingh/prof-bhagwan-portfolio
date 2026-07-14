const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const books = await prisma.book.findMany();
    console.log(books.map(b => ({ id: b.id, title: b.title, coverImageUrl: b.coverImageUrl })));
}

main().finally(() => prisma.$disconnect());
