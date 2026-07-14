import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    // ─── SITE SETTINGS ────────────────────────────────────
    async getSettings(category?: string) {
        const where: any = {};
        if (category) where.category = category;
        return this.prisma.siteSetting.findMany({ where });
    }

    async getSetting(key: string) {
        return this.prisma.siteSetting.findUnique({ where: { key } });
    }

    async upsertSetting(key: string, value: string, category = 'general') {
        return this.prisma.siteSetting.upsert({
            where: { key },
            update: { value, category },
            create: { key, value, category },
        });
    }

    // ─── SEO METADATA ─────────────────────────────────────
    async getSeoForPage(pageSlug: string) {
        return this.prisma.seoMetadata.findUnique({ where: { pageSlug } });
    }

    async getAllSeo() {
        return this.prisma.seoMetadata.findMany();
    }

    async upsertSeo(data: any) {
        return this.prisma.seoMetadata.upsert({
            where: { pageSlug: data.pageSlug },
            update: data,
            create: data,
        });
    }

    // ─── AUDIT LOGS ───────────────────────────────────────
    async createAuditLog(data: {
        userId?: string; action: string; entityType: string;
        entityId?: string; previousData?: any; newData?: any; ipAddress?: string;
    }) {
        return this.prisma.auditLog.create({ data });
    }

    async getAuditLogs(page = 1, limit = 50) {
        const [items, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                include: { user: { select: { fullName: true, email: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit, take: limit,
            }),
            this.prisma.auditLog.count(),
        ]);
        return { items, total, page, totalPages: Math.ceil(total / limit) };
    }
}
