import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsService {
    constructor(private prisma: PrismaService) { }

    // ─── PUBLICATIONS ──────────────────────────────────────
    async getPublications(tag?: string) {
        const where: any = { isActive: true };
        if (tag) where.tag = tag;
        return this.prisma.publication.findMany({ where, orderBy: [{ year: 'desc' }, { sortOrder: 'asc' }] });
    }

    async getAllPublications() {
        return this.prisma.publication.findMany({ orderBy: [{ year: 'desc' }, { sortOrder: 'asc' }] });
    }

    async upsertPublication(data: any) {
        const payload = {
            title: data.title,
            journal: data.journal,
            year: data.year,
            tag: data.tag,
            authors: data.authors,
            externalUrl: data.url || null,
            abstractText: data.abstract || null,
        };

        if (data.id) return this.prisma.publication.update({ where: { id: data.id }, data: payload });
        return this.prisma.publication.create({ data: payload });
    }

    async deletePublication(id: string) {
        return this.prisma.publication.delete({ where: { id } });
    }

    // ─── BOOKS ────────────────────────────────────────────
    async getBooks() {
        return this.prisma.book.findMany({ where: { isActive: true }, orderBy: { year: 'desc' } });
    }

    async upsertBook(data: any) {
        if (data.id) return this.prisma.book.update({ where: { id: data.id }, data });
        return this.prisma.book.create({ data });
    }

    async deleteBook(id: string) {
        return this.prisma.book.delete({ where: { id } });
    }
}
