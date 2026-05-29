import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService {
    constructor(private prisma: PrismaService) { }

    // ─── HERO SECTIONS ──────────────────────────────────────
    async getHeroSections() {
        return this.prisma.heroSection.findMany({
            where: { isActive: true },
            include: { images: { orderBy: { sortOrder: 'asc' } } },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async upsertHeroSection(data: any) {
        const { id, ...rest } = data;
        if (id) {
            return this.prisma.heroSection.update({ where: { id }, data: rest });
        }
        return this.prisma.heroSection.create({ data: rest });
    }

    async addHeroImage(heroSectionId: string, imageUrl: string, altText = '') {
        return this.prisma.heroImage.create({ data: { heroSectionId, imageUrl, altText } });
    }

    async deleteHeroImage(id: string) {
        return this.prisma.heroImage.delete({ where: { id } });
    }

    // ─── ABOUT CONTENT ─────────────────────────────────────
    async getAboutContent() {
        return this.prisma.aboutContent.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async upsertAboutContent(data: any) {
        const { id, ...rest } = data;
        if (id) {
            return this.prisma.aboutContent.update({ where: { id }, data: rest });
        }
        return this.prisma.aboutContent.create({ data: rest });
    }

    // ─── TIMELINE ─────────────────────────────────────────
    async getTimeline() {
        return this.prisma.experienceTimeline.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async getAllTimeline() {
        return this.prisma.experienceTimeline.findMany({ orderBy: { sortOrder: 'asc' } });
    }

    async upsertTimeline(data: any) {
        const { id, ...rest } = data;
        // Normalise empty strings to null for optional fields
        const clean = {
            ...rest,
            subtitle: rest.subtitle || null,
            location: rest.location || null,
            externalLink: rest.externalLink || null,
        };
        if (id) {
            return this.prisma.experienceTimeline.update({ where: { id }, data: clean });
        }
        return this.prisma.experienceTimeline.create({ data: clean });
    }

    async deleteTimeline(id: string) {
        return this.prisma.experienceTimeline.delete({ where: { id } });
    }

    // ─── COURSES ───────────────────────────────────────────
    async getCourses() {
        return this.prisma.course.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async upsertCourse(data: any) {
        const { id, ...rest } = data;
        if (id) {
            return this.prisma.course.update({ where: { id }, data: rest });
        }
        return this.prisma.course.create({ data: rest });
    }

    async deleteCourse(id: string) {
        return this.prisma.course.delete({ where: { id } });
    }

    // ─── ACHIEVEMENTS ─────────────────────────────────────
    async getAchievements() {
        return this.prisma.achievement.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async upsertAchievement(data: any) {
        const { id, ...rest } = data;
        if (id) {
            return this.prisma.achievement.update({ where: { id }, data: rest });
        }
        return this.prisma.achievement.create({ data: rest });
    }

    async deleteAchievement(id: string) {
        return this.prisma.achievement.delete({ where: { id } });
    }

    // ─── PHD SCHOLARS ─────────────────────────────────────
    async getScholars() {
        return this.prisma.phdScholar.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async upsertScholar(data: any) {
        const { id, ...rest } = data;
        // Normalise empty strings to null for optional fields
        const clean = {
            ...rest,
            imageUrl: rest.imageUrl || null,
            researchTopic: rest.researchTopic || null,
            currentPosition: rest.currentPosition || null,
        };
        if (id) {
            return this.prisma.phdScholar.update({ where: { id }, data: clean });
        }
        return this.prisma.phdScholar.create({ data: clean });
    }

    async deleteScholar(id: string) {
        return this.prisma.phdScholar.delete({ where: { id } });
    }

    // ─── ANNOUNCEMENTS ────────────────────────────────────
    async getAnnouncements() {
        return this.prisma.announcement.findMany({
            where: { isActive: true },
            orderBy: [{ isPinned: 'desc' }, { publishDate: 'desc' }],
        });
    }

    async upsertAnnouncement(data: any) {
        const { id, ...rest } = data;
        if (id) {
            return this.prisma.announcement.update({ where: { id }, data: rest });
        }
        return this.prisma.announcement.create({ data: rest });
    }

    async deleteAnnouncement(id: string) {
        return this.prisma.announcement.delete({ where: { id } });
    }

    // ─── SOCIAL LINKS ─────────────────────────────────────
    async getSocialLinks() {
        return this.prisma.socialLink.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async upsertSocialLink(data: any) {
        const { id, ...rest } = data;
        if (id) {
            return this.prisma.socialLink.update({ where: { id }, data: rest });
        }
        return this.prisma.socialLink.create({ data: rest });
    }

    async deleteSocialLink(id: string) {
        return this.prisma.socialLink.delete({ where: { id } });
    }
}
