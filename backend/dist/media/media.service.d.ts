import { ConfigService } from '@nestjs/config';
export declare class MediaService {
    private config;
    constructor(config: ConfigService);
    saveFile(file: any, folder?: string): Promise<{
        url: string;
        filename: string;
    }>;
    deleteFile(fileUrlOrPublicId: string): Promise<void>;
}
