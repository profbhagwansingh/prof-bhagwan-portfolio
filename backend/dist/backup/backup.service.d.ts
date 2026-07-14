import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class BackupService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    private readonly backupDir;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    handleCronBackup(): Promise<void>;
    createBackup(type?: string): Promise<void>;
    private cleanupOldBackups;
}
