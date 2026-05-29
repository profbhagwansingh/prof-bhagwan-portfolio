import { ConfigService } from '@nestjs/config';
export declare class MediaService {
    private config;
    constructor(config: ConfigService);
    saveFile(file: any): Promise<{
        url: string;
        filename: string;
    }>;
    deleteFile(fileUrl: string): Promise<void>;
}
