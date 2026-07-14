import { MediaService } from './media.service';
export declare class MediaController {
    private mediaService;
    constructor(mediaService: MediaService);
    uploadFile(file: any): Promise<{
        url: string;
        filename: string;
    }>;
    uploadMultiple(files: any[]): Promise<{
        url: string;
        filename: string;
    }[]>;
    deleteFile(url: string): Promise<{
        message: string;
    }>;
}
