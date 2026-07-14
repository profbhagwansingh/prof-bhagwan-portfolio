import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);
    private readonly useCloudinary: boolean;

    constructor(private config: ConfigService) {
        const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
        const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');

        this.useCloudinary = !!(cloudName && apiKey && apiSecret);

        if (this.useCloudinary) {
            cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
            });
            this.logger.log('☁️  Cloudinary configured for file uploads');
        } else {
            this.logger.warn('⚠️  Cloudinary credentials missing — using local file storage');
        }
    }

    async saveFile(file: any): Promise<{ url: string; filename: string }> {
        if (this.useCloudinary) {
            return this._saveToCloudinary(file);
        }
        return this._saveLocally(file);
    }

    private async _saveToCloudinary(file: any): Promise<{ url: string; filename: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'profbhagwan', resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result?.secure_url || !result?.public_id) {
                        return reject(new Error('Invalid upload result'));
                    }
                    resolve({ url: result.secure_url, filename: result.public_id });
                }
            ).end(file.buffer);
        });
    }

    private async _saveLocally(file: any): Promise<{ url: string; filename: string }> {
        const uploadDir = path.join(process.cwd(), 'uploads', 'media');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = path.extname(file.originalname || '.bin');
        const safeName = `${uuidv4()}${ext}`;
        const filePath = path.join(uploadDir, safeName);

        fs.writeFileSync(filePath, file.buffer);

        const url = `/uploads/media/${safeName}`;
        return { url, filename: safeName };
    }

    async deleteFile(fileUrl: string): Promise<void> {
        if (this.useCloudinary) {
            try {
                await cloudinary.uploader.destroy(fileUrl);
            } catch (e) {
                console.error('Cloudinary delete error:', e);
            }
        } else {
            // Local file deletion
            try {
                const filePath = path.join(process.cwd(), fileUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (e) {
                console.error('Local file delete error:', e);
            }
        }
    }
}