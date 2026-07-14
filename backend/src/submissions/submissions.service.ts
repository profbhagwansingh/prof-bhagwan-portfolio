import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { SubmissionStatus, AlumniStatus } from '@prisma/client';

@Injectable()
export class SubmissionsService {
    private readonly logger = new Logger(SubmissionsService.name);

    constructor(
        private prisma: PrismaService,
        private mediaService: MediaService,
    ) { }

    // ─── CONTACT SUBMISSIONS ──────────────────────────────
    async createContact(data: { name: string; email: string; whatsapp?: string; message: string }) {
        return this.prisma.contactSubmission.create({ data });
    }

    async getContacts(status?: SubmissionStatus, page = 1, limit = 20) {
        const where: any = {};
        if (status) where.status = status;
        const [items, total] = await Promise.all([
            this.prisma.contactSubmission.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            this.prisma.contactSubmission.count({ where }),
        ]);
        return { items, total, page, totalPages: Math.ceil(total / limit) };
    }

    async updateContactStatus(id: string, status: SubmissionStatus) {
        return this.prisma.contactSubmission.update({ where: { id }, data: { status } });
    }

    async deleteContact(id: string) {
        return this.prisma.contactSubmission.delete({ where: { id } });
    }

    // ─── ALUMNI SUBMISSIONS ───────────────────────────────
    async createAlumni(data: any, file?: any) {
        let pictureUrl: string | null = null;

        // Upload profile picture if provided
        if (file) {
            try {
                const result = await this.mediaService.saveFile(file);
                pictureUrl = result.url;
            } catch (err) {
                this.logger.warn('Alumni photo upload failed, proceeding without photo', err);
            }
        }

        // Strip out any base64 pictureUrl sent from body to avoid DB bloat
        const { pictureUrl: _bodyPicUrl, ...rest } = data;

        return this.prisma.alumniSubmission.create({
            data: {
                ...rest,
                pictureUrl,
            },
        });
    }

    async getAlumni(status?: AlumniStatus, page = 1, limit = 20) {
        const where: any = {};
        if (status) where.status = status;
        const [items, total] = await Promise.all([
            this.prisma.alumniSubmission.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            this.prisma.alumniSubmission.count({ where }),
        ]);
        return { items, total, page, totalPages: Math.ceil(total / limit) };
    }

    async updateAlumniStatus(id: string, status: AlumniStatus) {
        return this.prisma.alumniSubmission.update({ where: { id }, data: { status } });
    }

    async deleteAlumni(id: string) {
        return this.prisma.alumniSubmission.delete({ where: { id } });
    }

    // ─── DASHBOARD STATS ──────────────────────────────────
    async getDashboardStats() {
        const [
            contactCount,
            alumniCount,
            newContacts,
            newAlumni,
            publicationCount,
            galleryItemCount,
            slideshowCount,
            courseCount,
            scholarCount,
            timelineCount,
            bookCount,
            achievementCount,
            announcementCount,
        ] = await Promise.all([
            this.prisma.contactSubmission.count(),
            this.prisma.alumniSubmission.count(),
            this.prisma.contactSubmission.count({ where: { status: 'NEW' } }),
            this.prisma.alumniSubmission.count({ where: { status: 'NEW' } }),
            this.prisma.publication.count(),
            this.prisma.galleryItem.count(),
            this.prisma.galleryItem.count({ where: { isSlideshow: true } }),
            this.prisma.course.count({ where: { isActive: true } }),
            this.prisma.phdScholar.count({ where: { isActive: true } }),
            this.prisma.experienceTimeline.count({ where: { isActive: true } }),
            this.prisma.book.count({ where: { isActive: true } }),
            this.prisma.achievement.count({ where: { isActive: true } }),
            this.prisma.announcement.count({ where: { isActive: true } }),
        ]);

        // Recent activity — last 10 items across contacts and alumni
        const [recentContacts, recentAlumni] = await Promise.all([
            this.prisma.contactSubmission.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, name: true, createdAt: true, status: true },
            }),
            this.prisma.alumniSubmission.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, fullName: true, createdAt: true, status: true },
            }),
        ]);

        const recentActivity = [
            ...recentContacts.map((c) => ({
                id: c.id,
                type: 'contact' as const,
                text: `New message from ${c.name}`,
                time: c.createdAt,
                status: c.status,
            })),
            ...recentAlumni.map((a) => ({
                id: a.id,
                type: 'alumni' as const,
                text: `Alumni registration: ${a.fullName}`,
                time: a.createdAt,
                status: a.status,
            })),
        ]
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 8);

        return {
            contacts: { total: contactCount, new: newContacts },
            alumni: { total: alumniCount, new: newAlumni },
            publications: publicationCount,
            galleryItems: galleryItemCount,
            slideshowImages: slideshowCount,
            courses: courseCount,
            scholars: scholarCount,
            timeline: timelineCount,
            books: bookCount,
            achievements: achievementCount,
            announcements: announcementCount,
            recentActivity,
        };
    }
}
