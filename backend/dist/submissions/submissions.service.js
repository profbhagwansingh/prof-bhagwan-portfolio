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
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubmissionsService = class SubmissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createContact(data) {
        return this.prisma.contactSubmission.create({ data });
    }
    async getContacts(status, page = 1, limit = 20) {
        const where = {};
        if (status)
            where.status = status;
        const [items, total] = await Promise.all([
            this.prisma.contactSubmission.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            this.prisma.contactSubmission.count({ where }),
        ]);
        return { items, total, page, totalPages: Math.ceil(total / limit) };
    }
    async updateContactStatus(id, status) {
        return this.prisma.contactSubmission.update({ where: { id }, data: { status } });
    }
    async deleteContact(id) {
        return this.prisma.contactSubmission.delete({ where: { id } });
    }
    async createAlumni(data) {
        return this.prisma.alumniSubmission.create({ data });
    }
    async getAlumni(status, page = 1, limit = 20) {
        const where = {};
        if (status)
            where.status = status;
        const [items, total] = await Promise.all([
            this.prisma.alumniSubmission.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            this.prisma.alumniSubmission.count({ where }),
        ]);
        return { items, total, page, totalPages: Math.ceil(total / limit) };
    }
    async updateAlumniStatus(id, status) {
        return this.prisma.alumniSubmission.update({ where: { id }, data: { status } });
    }
    async deleteAlumni(id) {
        return this.prisma.alumniSubmission.delete({ where: { id } });
    }
    async getDashboardStats() {
        const [contactCount, alumniCount, newContacts, newAlumni] = await Promise.all([
            this.prisma.contactSubmission.count(),
            this.prisma.alumniSubmission.count(),
            this.prisma.contactSubmission.count({ where: { status: 'NEW' } }),
            this.prisma.alumniSubmission.count({ where: { status: 'NEW' } }),
        ]);
        return { contactCount, alumniCount, newContacts, newAlumni };
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map