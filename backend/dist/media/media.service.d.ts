import { ConfigService } from '@nestjs/config';
export declare class MediaService {
    private config;
    constructor(config: ConfigService);
    saveFile(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    deleteFile(fileUrl: string): Promise<void>;
}
