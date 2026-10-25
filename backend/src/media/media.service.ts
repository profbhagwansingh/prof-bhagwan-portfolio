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

    async saveFile(file: any, folder = 'profbhagwan'): Promise<{ url: string; filename: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder, resource_type: 'auto' },
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

    async deleteFile(fileUrlOrPublicId: string): Promise<void> {
        try {
            if (!fileUrlOrPublicId) return;
            let publicId = fileUrlOrPublicId;
            if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
                const parts = publicId.split('/upload/');
                if (parts.length > 1) {
                    const pathAfterUpload = parts[1].replace(/^v\d+\//, '');
                    publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
                }
            }
            await cloudinary.uploader.destroy(publicId);
        } catch (e) {
            console.error('Cloudinary delete error:', e);
        }
    }
}