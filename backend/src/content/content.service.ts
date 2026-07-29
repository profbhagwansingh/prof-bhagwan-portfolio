import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { GalleryService } from '../gallery/gallery.service';

@Injectable()
export class ContentService {
    constructor(private prisma: PrismaService, private galleryService: GalleryService) { }

    // ─── HOMEPAGE CONSOLIDATED DATA ───────────────────────
    async getHomepageData() {
        // Run all queries in parallel
        const [
            quickStats,
            courses,
            scholarsCount,
            invitedLecturesCount,
            publicationsCount,
            booksCount,
            bookChaptersCount,
            settings
        ] = await Promise.all([
            this.prisma.quickStat.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
            this.prisma.course.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
            this.prisma.phdScholar.count(),
            this.prisma.invitedLecture.count(),
            this.prisma.publication.count({ where: { isActive: true } }),
            this.prisma.book.count({ where: { isActive: true } }),
            this.prisma.bookChapter.count({ where: { isActive: true } }),
            this.prisma.siteSetting.findMany()
        ]);

        let slideshow: string[] = [];
        try {
            const files = await this.galleryService.scanSlideshowFiles();
            slideshow = files.map(f => `/media/img/slideshow/${f}`);
        } catch (e) {
            console.error('Failed to get slideshow files:', e);
        }

        return {
            quickStats,
            courses,
            scholarsCount,
            invitedLecturesCount,
            publicationsCount,
            booksCount,
            bookChaptersCount,
            settings,
            slideshow
        };
    }

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

    // ─── BOOKS ────────────────────────────────────────────
    async getBooks() {
        return this.prisma.book.findMany({
            where: { isActive: true },
            orderBy: [{ year: 'desc' }, { sortOrder: 'asc' }],
        });
    }

    async upsertBook(data: any) {
        const { id, ...rest } = data;
        // Normalise empty strings to null for optional fields
        const clean = {
            ...rest,
            subtitle: rest.subtitle || null,
            coverImageUrl: rest.coverImageUrl || null,
            purchaseUrl: rest.purchaseUrl || null,
            isbn: rest.isbn || null,
        };
        if (id) {
            return this.prisma.book.update({ where: { id }, data: clean });
        }
        return this.prisma.book.create({ data: clean });
    }

    async deleteBook(id: string) {
        return this.prisma.book.delete({ where: { id } });
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

    // ─── INVITED LECTURES ─────────────────────────────────────
    async getInvitedLectures() {
        return this.prisma.invitedLecture.findMany({
            where: { isActive: true },
            orderBy: [{ slNo: 'asc' }],
        });
    }

    async upsertInvitedLecture(data: any) {
        const { id, ...rest } = data;
        if (id) {
            return this.prisma.invitedLecture.update({ where: { id }, data: rest });
        }
        return this.prisma.invitedLecture.create({ data: rest });
    }

    async deleteInvitedLecture(id: string) {
        return this.prisma.invitedLecture.delete({ where: { id } });
    }

    // ─── QUICK STATS ──────────────────────────────────────
    async getQuickStats() {
        return this.prisma.quickStat.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async upsertQuickStat(data: any) {
        const { id, ...rest } = data;
        if (id) {
            return this.prisma.quickStat.update({ where: { id }, data: rest });
        }
        return this.prisma.quickStat.create({ data: rest });
    }

    async deleteQuickStat(id: string) {
        return this.prisma.quickStat.delete({ where: { id } });
    }
}
