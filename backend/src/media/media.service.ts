import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MediaService {
    private uploadDir: string;

    constructor(private config: ConfigService) {
        this.uploadDir = this.config.get<string>('UPLOAD_DIR', './uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
        const ext = path.extname(file.originalname);
        const filename = `${uuid()}${ext}`;
        const now = new Date();
        const subDir = path.join(this.uploadDir, `${now.getFullYear()}`, `${now.getMonth() + 1}`);

        if (!fs.existsSync(subDir)) {
            fs.mkdirSync(subDir, { recursive: true });
        }

        const filePath = path.join(subDir, filename);
        fs.writeFileSync(filePath, file.buffer);

        const relativePath = path.relative(this.uploadDir, filePath).replace(/\\/g, '/');
        return { url: `/uploads/${relativePath}`, filename };
    }

    async deleteFile(fileUrl: string): Promise<void> {
        const filePath = path.join(this.uploadDir, fileUrl.replace('/uploads/', ''));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
