"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EcrrbService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrrbService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const media_service_1 = require("../media/media.service");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
require("multer");
let EcrrbService = EcrrbService_1 = class EcrrbService {
    constructor(prisma, mediaService) {
        this.prisma = prisma;
        this.mediaService = mediaService;
        this.logger = new common_1.Logger(EcrrbService_1.name);
    }
    async processApplication(data, files) {
        try {
            let photoUrl = null;
            if (files.photo && files.photo.length > 0) {
                const result = await this.mediaService.saveFile(files.photo[0]);
                photoUrl = result.url;
            }
            let cvUrl = null;
            if (files.cv && files.cv.length > 0) {
                const result = await this.mediaService.saveFile(files.cv[0]);
                cvUrl = result.url;
            }
            let scopusExportUrl = null;
            if (files.scopusExport && files.scopusExport.length > 0) {
                const result = await this.mediaService.saveFile(files.scopusExport[0]);
                scopusExportUrl = result.url;
            }
            let certificateUrl = null;
            if (files.certificate && files.certificate.length > 0) {
                const result = await this.mediaService.saveFile(files.certificate[0]);
                certificateUrl = result.url;
            }
            const paperUrls = [];
            if (files.papers && files.papers.length > 0) {
                for (const paper of files.papers) {
                    const result = await this.mediaService.saveFile(paper);
                    paperUrls.push(result.url);
                }
            }
            const application = await this.prisma.ecrrbApplication.create({
                data: {
                    fullName: data.fullName,
                    dateOfBirth: new Date(data.dateOfBirth),
                    photoUrl,
                    designation: data.designation,
                    affiliation: data.affiliation,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    category: data.category,
                    highestQualification: data.highestQualification,
                    specialization: data.specialization,
                    yearsOfExperience: parseInt(data.yearsOfExperience) || 0,
                    experienceSummary: data.experienceSummary,
                    scopusId: data.scopusId || null,
                    scopusLink: data.scopusLink || null,
                    totalScopusPubs: data.totalScopusPubs ? parseInt(data.totalScopusPubs) : null,
                    hIndex: data.hIndex ? parseInt(data.hIndex) : null,
                    cvUrl,
                    scopusExportUrl,
                    paperUrls,
                    hasEthicsTraining: data.hasEthicsTraining === 'true' || data.hasEthicsTraining === true,
                    certificateUrl,
                    digitalSignature: data.digitalSignature,
                },
            });
            this.logger.log(`New ECRRB Application received from ${application.email}`);
            return {
                success: true,
                message: 'Application submitted successfully',
                applicationId: application.id,
            };
        }
        catch (error) {
            this.logger.error('Failed to process application:', error);
            throw error;
        }
    }
    async getAllApplications() {
        return this.prisma.ecrrbApplication.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                fullName: true,
                email: true,
                category: true,
                createdAt: true,
            }
        });
    }
    async getApplicationDetails(id) {
        const application = await this.prisma.ecrrbApplication.findUnique({
            where: { id }
        });
        if (!application)
            throw new Error("Application not found");
        return application;
    }
    async deleteApplication(id) {
        return this.prisma.ecrrbApplication.delete({
            where: { id }
        });
    }
    async processCertification(data, files) {
        try {
            const saveFile = (fileArray) => {
                if (!fileArray || fileArray.length === 0)
                    return null;
                const file = fileArray[0];
                const uploadDir = path.join(process.cwd(), 'uploads', 'ecrrb-certifications');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, file.buffer);
                return `/uploads/ecrrb-certifications/${fileName}`;
            };
            const protocolUrl = saveFile(files.protocol);
            const icfUrl = saveFile(files.icf);
            const piCvUrl = saveFile(files.piCv);
            const researchPaperUrl = saveFile(files.researchPaper);
            const priorApprovalUrl = saveFile(files.priorApproval);
            const toolUrls = [];
            if (files.tools) {
                for (const file of files.tools) {
                    const uploadDir = path.join(process.cwd(), 'uploads', 'ecrrb-certifications');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                    const filePath = path.join(uploadDir, fileName);
                    fs.writeFileSync(filePath, file.buffer);
                    toolUrls.push(`/uploads/ecrrb-certifications/${fileName}`);
                }
            }
            const certification = await this.prisma.ecrrbCertification.create({
                data: {
                    piName: data.piName,
                    piDesignation: data.piDesignation,
                    piInstitution: data.piInstitution,
                    piEmail: data.piEmail,
                    piPhone: data.piPhone,
                    coInvestigators: data.coInvestigators || null,
                    orcidScopusId: data.orcidScopusId || null,
                    studyTitle: data.studyTitle,
                    submissionType: data.submissionType,
                    researchType: data.researchType,
                    startDate: new Date(data.startDate),
                    duration: data.duration,
                    studySites: data.studySites || null,
                    journalName: data.journalName || null,
                    objectives: data.objectives,
                    methodology: data.methodology,
                    studyPopulation: data.studyPopulation,
                    sampleSize: parseInt(data.sampleSize, 10),
                    inclusionExclusion: data.inclusionExclusion || null,
                    vulnerable: data.vulnerable,
                    vulnerableSafeguards: data.vulnerableSafeguards || null,
                    risks: data.risks,
                    benefits: data.benefits,
                    consentProcess: data.consentProcess,
                    confidentiality: data.confidentiality,
                    compensation: data.compensation || null,
                    isFunded: data.isFunded,
                    fundingAgency: data.fundingAgency || null,
                    coiDeclared: data.coiDeclared === true || data.coiDeclared === 'true',
                    protocolUrl,
                    icfUrl,
                    toolUrls,
                    piCvUrl,
                    researchPaperUrl,
                    priorApprovalUrl,
                    dec1: data.dec1 === true || data.dec1 === 'true',
                    dec2: data.dec2 === true || data.dec2 === 'true',
                    dec3: data.dec3 === true || data.dec3 === 'true',
                    digitalSignature: data.digitalSignature,
                    applicationDate: new Date(data.applicationDate),
                },
            });
            return {
                success: true,
                message: 'Certification application submitted successfully',
                applicationId: certification.id,
            };
        }
        catch (error) {
            this.logger.error('Failed to process certification application:', error);
            throw error;
        }
    }
    async getAllCertifications() {
        return this.prisma.ecrrbCertification.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                piName: true,
                studyTitle: true,
                piEmail: true,
                submissionType: true,
                createdAt: true,
            }
        });
    }
    async getCertificationDetails(id) {
        const certification = await this.prisma.ecrrbCertification.findUnique({
            where: { id }
        });
        if (!certification)
            throw new Error("Certification application not found");
        return certification;
    }
    async deleteCertification(id) {
        return this.prisma.ecrrbCertification.delete({
            where: { id }
        });
    }
};
exports.EcrrbService = EcrrbService;
exports.EcrrbService = EcrrbService = EcrrbService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        media_service_1.MediaService])
], EcrrbService);
//# sourceMappingURL=ecrrb.service.js.map