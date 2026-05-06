import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class GalleryService {
    constructor(private prisma: PrismaService) { }

    // ─── CATEGORIES ────────────────────────────────────────
    async getCategories() {
        return this.prisma.galleryCategory.findMany({
            include: { items: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async upsertCategory(data: any) {
        if (data.id) return this.prisma.galleryCategory.update({ where: { id: data.id }, data });
        return this.prisma.galleryCategory.create({ data });
    }

    async deleteCategory(id: string) {
        return this.prisma.galleryCategory.delete({ where: { id } });
    }

    // ─── ITEMS ─────────────────────────────────────────────
    async getItems(categorySlug?: string, mediaType?: MediaType, page = 1, limit = 20) {
        const where: any = { isActive: true };
        if (categorySlug) {
            const cat = await this.prisma.galleryCategory.findUnique({ where: { slug: categorySlug } });
            if (cat) where.categoryId = cat.id;
        }
        if (mediaType) where.mediaType = mediaType;

        const [items, total] = await Promise.all([
            this.prisma.galleryItem.findMany({
                where,
                include: { category: true },
                orderBy: { sortOrder: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.galleryItem.count({ where }),
        ]);

        return { items, total, page, totalPages: Math.ceil(total / limit) };
    }

    async upsertItem(data: any) {
        if (data.id) return this.prisma.galleryItem.update({ where: { id: data.id }, data });
        return this.prisma.galleryItem.create({ data });
    }

    async deleteItem(id: string) {
        return this.prisma.galleryItem.delete({ where: { id } });
    }
}
