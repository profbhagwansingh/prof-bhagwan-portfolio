import { MediaService } from './media.service';
export declare class MediaController {
    private mediaService;
    constructor(mediaService: MediaService);
    uploadFile(file: any): Promise<{
        url: string;
        secure_url: string;
        filename: string;
        public_id: string;
    }>;
    uploadMultiple(files: any[]): Promise<{
        url: string;
        secure_url: string;
        filename: string;
        public_id: string;
    }[]>;
    deleteFile(url: string): Promise<{
        message: string;
    }>;
}
