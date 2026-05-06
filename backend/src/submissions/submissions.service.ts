import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus, AlumniStatus } from '@prisma/client';

@Injectable()
export class SubmissionsService {
    constructor(private prisma: PrismaService) { }

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
    async createAlumni(data: any) {
        return this.prisma.alumniSubmission.create({ data });
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
        const [contactCount, alumniCount, newContacts, newAlumni] = await Promise.all([
            this.prisma.contactSubmission.count(),
            this.prisma.alumniSubmission.count(),
            this.prisma.contactSubmission.count({ where: { status: 'NEW' } }),
            this.prisma.alumniSubmission.count({ where: { status: 'NEW' } }),
        ]);
        return { contactCount, alumniCount, newContacts, newAlumni };
    }
}
