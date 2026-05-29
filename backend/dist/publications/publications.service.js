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
exports.PublicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PublicationsService = class PublicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublications(tag) {
        const where = { isActive: true };
        if (tag)
            where.tag = tag;
        return this.prisma.publication.findMany({ where, orderBy: [{ year: 'desc' }, { sortOrder: 'asc' }] });
    }
    async getAllPublications() {
        return this.prisma.publication.findMany({ orderBy: [{ year: 'desc' }, { sortOrder: 'asc' }] });
    }
    async upsertPublication(data) {
        const payload = {
            title: data.title,
            journal: data.journal,
            year: data.year,
            tag: data.tag,
            authors: data.authors,
            externalUrl: data.url || null,
            abstractText: data.abstract || null,
        };
        if (data.id)
            return this.prisma.publication.update({ where: { id: data.id }, data: payload });
        return this.prisma.publication.create({ data: payload });
    }
    async deletePublication(id) {
        return this.prisma.publication.delete({ where: { id } });
    }
    async getBooks() {
        return this.prisma.book.findMany({ where: { isActive: true }, orderBy: { year: 'desc' } });
    }
    async upsertBook(data) {
        if (data.id)
            return this.prisma.book.update({ where: { id: data.id }, data });
        return this.prisma.book.create({ data });
    }
    async deleteBook(id) {
        return this.prisma.book.delete({ where: { id } });
    }
};
exports.PublicationsService = PublicationsService;
exports.PublicationsService = PublicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicationsService);
//# sourceMappingURL=publications.service.js.map