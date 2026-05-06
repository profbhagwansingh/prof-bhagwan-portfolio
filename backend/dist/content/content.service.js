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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContentService = class ContentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHeroSections() {
        return this.prisma.heroSection.findMany({
            where: { isActive: true },
            include: { images: { orderBy: { sortOrder: 'asc' } } },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async upsertHeroSection(data) {
        if (data.id) {
            return this.prisma.heroSection.update({ where: { id: data.id }, data });
        }
        return this.prisma.heroSection.create({ data });
    }
    async addHeroImage(heroSectionId, imageUrl, altText = '') {
        return this.prisma.heroImage.create({ data: { heroSectionId, imageUrl, altText } });
    }
    async deleteHeroImage(id) {
        return this.prisma.heroImage.delete({ where: { id } });
    }
    async getAboutContent() {
        return this.prisma.aboutContent.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async upsertAboutContent(data) {
        if (data.id) {
            return this.prisma.aboutContent.update({ where: { id: data.id }, data });
        }
        return this.prisma.aboutContent.create({ data });
    }
    async getTimeline() {
        return this.prisma.experienceTimeline.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async getAllTimeline() {
        return this.prisma.experienceTimeline.findMany({ orderBy: { sortOrder: 'asc' } });
    }
    async upsertTimeline(data) {
        if (data.id) {
            return this.prisma.experienceTimeline.update({ where: { id: data.id }, data });
        }
        return this.prisma.experienceTimeline.create({ data });
    }
    async deleteTimeline(id) {
        return this.prisma.experienceTimeline.delete({ where: { id } });
    }
    async getCourses() {
        return this.prisma.course.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async upsertCourse(data) {
        if (data.id) {
            return this.prisma.course.update({ where: { id: data.id }, data });
        }
        return this.prisma.course.create({ data });
    }
    async deleteCourse(id) {
        return this.prisma.course.delete({ where: { id } });
    }
    async getAchievements() {
        return this.prisma.achievement.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async upsertAchievement(data) {
        if (data.id) {
            return this.prisma.achievement.update({ where: { id: data.id }, data });
        }
        return this.prisma.achievement.create({ data });
    }
    async deleteAchievement(id) {
        return this.prisma.achievement.delete({ where: { id } });
    }
    async getScholars() {
        return this.prisma.phdScholar.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async upsertScholar(data) {
        if (data.id) {
            return this.prisma.phdScholar.update({ where: { id: data.id }, data });
        }
        return this.prisma.phdScholar.create({ data });
    }
    async deleteScholar(id) {
        return this.prisma.phdScholar.delete({ where: { id } });
    }
    async getAnnouncements() {
        return this.prisma.announcement.findMany({
            where: { isActive: true },
            orderBy: [{ isPinned: 'desc' }, { publishDate: 'desc' }],
        });
    }
    async upsertAnnouncement(data) {
        if (data.id) {
            return this.prisma.announcement.update({ where: { id: data.id }, data });
        }
        return this.prisma.announcement.create({ data });
    }
    async deleteAnnouncement(id) {
        return this.prisma.announcement.delete({ where: { id } });
    }
    async getSocialLinks() {
        return this.prisma.socialLink.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async upsertSocialLink(data) {
        if (data.id) {
            return this.prisma.socialLink.update({ where: { id: data.id }, data });
        }
        return this.prisma.socialLink.create({ data });
    }
    async deleteSocialLink(id) {
        return this.prisma.socialLink.delete({ where: { id } });
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map