import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService implements OnModuleInit {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = path.join(process.cwd(), 'backups');

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    this.logger.log('Backup service initialized. Backups will be stored in: ' + this.backupDir);
    // Auto-backup on startup (run asynchronously to avoid blocking server boot)
    setTimeout(() => {
      this.createBackup('startup').catch(err => this.logger.error('Startup backup failed', err));
    }, 10000); // 10 second delay after boot
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async handleCronBackup() {
    this.logger.log('Running scheduled auto-backup...');
    await this.createBackup('scheduled');
  }

  async createBackup(type: string = 'manual') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${type}-${timestamp}.json`;
      const filepath = path.join(this.backupDir, filename);

      this.logger.log(`Starting database backup: ${filename}`);

      // Collect all data from Prisma models
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

      // Keep only last 10 backups to save space
      this.cleanupOldBackups();
    } catch (error) {
      this.logger.error('❌ Failed to create backup', error);
    }
  }

  private cleanupOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(f => f.endsWith('.json') && f.startsWith('backup-'))
        .map(f => ({ name: f, time: fs.statSync(path.join(this.backupDir, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time); // newest first

      if (files.length > 10) {
        const toDelete = files.slice(10);
        for (const file of toDelete) {
          fs.unlinkSync(path.join(this.backupDir, file.name));
          this.logger.log(`Deleted old backup: ${file.name}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to cleanup old backups', error);
    }
  }
}
