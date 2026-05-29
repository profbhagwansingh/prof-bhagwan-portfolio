import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService {
    constructor(private config: ConfigService) {
        cloudinary.config({
            cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async saveFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
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

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(fileUrl);
        } catch (e) {
            console.error('Cloudinary delete error:', e);
        }
    }
}