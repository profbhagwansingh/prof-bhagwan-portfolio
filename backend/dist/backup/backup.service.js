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
var BackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let BackupService = BackupService_1 = class BackupService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BackupService_1.name);
        this.backupDir = path.join(process.cwd(), 'backups');
    }
    async onModuleInit() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        this.logger.log('Backup service initialized. Backups will be stored in: ' + this.backupDir);
        await this.createBackup('startup');
    }
    async handleCronBackup() {
        this.logger.log('Running scheduled auto-backup...');
        await this.createBackup('scheduled');
    }
    async createBackup(type = 'manual') {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `backup-${type}-${timestamp}.json`;
            const filepath = path.join(this.backupDir, filename);
            this.logger.log(`Starting database backup: ${filename}`);
            const backupData = {
                timestamp: new Date().toISOString(),
                type,
                data: {
                    users: await this.prisma.user.findMany(),
                    heroSections: await this.prisma.heroSection.findMany({ include: { images: true } }),
                    aboutContent: await this.prisma.aboutContent.findMany(),
                    experienceTimeline: await this.prisma.experienceTimeline.findMany(),
                    courses: await this.prisma.course.findMany(),
                    publications: await this.prisma.publication.findMany(),
                    books: await this.prisma.book.findMany(),
                    invitedLectures: await this.prisma.invitedLecture.findMany(),
                    achievements: await this.prisma.achievement.findMany(),
                    phdScholars: await this.prisma.phdScholar.findMany(),
                    announcements: await this.prisma.announcement.findMany(),
                    socialLinks: await this.prisma.socialLink.findMany(),
                    galleryCategories: await this.prisma.galleryCategory.findMany({ include: { items: true } }),
                }
            };
            fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2), 'utf-8');
            this.logger.log(`✅ Backup successfully saved to ${filepath}`);
            this.cleanupOldBackups();
        }
        catch (error) {
            this.logger.error('❌ Failed to create backup', error);
        }
    }
    cleanupOldBackups() {
        try {
            const files = fs.readdirSync(this.backupDir)
                .filter(f => f.endsWith('.json') && f.startsWith('backup-'))
                .map(f => ({ name: f, time: fs.statSync(path.join(this.backupDir, f)).mtime.getTime() }))
                .sort((a, b) => b.time - a.time);
            if (files.length > 10) {
                const toDelete = files.slice(10);
                for (const file of toDelete) {
                    fs.unlinkSync(path.join(this.backupDir, file.name));
                    this.logger.log(`Deleted old backup: ${file.name}`);
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to cleanup old backups', error);
        }
    }
};
exports.BackupService = BackupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_6_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupService.prototype, "handleCronBackup", null);
exports.BackupService = BackupService = BackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BackupService);
//# sourceMappingURL=backup.service.js.map