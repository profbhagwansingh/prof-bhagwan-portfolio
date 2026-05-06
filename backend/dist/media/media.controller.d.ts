import { MediaService } from './media.service';
export declare class MediaController {
    private mediaService;
    constructor(mediaService: MediaService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadMultiple(files: Express.Multer.File[]): Promise<{
        url: string;
        filename: string;
    }[]>;
    deleteFile(url: string): Promise<{
        message: string;
    }>;
}
