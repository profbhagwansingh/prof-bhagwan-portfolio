"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings(category) {
        const where = {};
        if (category)
            where.category = category;
        return this.prisma.siteSetting.findMany({ where });
    }
    async getSetting(key) {
        return this.prisma.siteSetting.findUnique({ where: { key } });
    }
    async upsertSetting(key, value, category = 'general') {
        return this.prisma.siteSetting.upsert({
            where: { key },
            update: { value, category },
            create: { key, value, category },
        });
    }
    async getSeoForPage(pageSlug) {
        return this.prisma.seoMetadata.findUnique({ where: { pageSlug } });
    }
    async getAllSeo() {
        return this.prisma.seoMetadata.findMany();
    }
    async upsertSeo(data) {
        return this.prisma.seoMetadata.upsert({
            where: { pageSlug: data.pageSlug },
            update: data,
            create: data,
        });
    }
    async createAuditLog(data) {
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
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map