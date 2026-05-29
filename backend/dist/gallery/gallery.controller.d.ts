import { GalleryService } from './gallery.service';
import { MediaType } from '@prisma/client';
export declare class GalleryController {
    private galleryService;
    constructor(galleryService: GalleryService);
    getCategories(): Promise<({
        items: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            sortOrder: number;
            altText: string;
            categoryId: string;
            mediaType: import(".prisma/client").$Enums.MediaType;
            mediaUrl: string;
            thumbnailUrl: string | null;
            caption: string | null;
            isSlideshow: boolean;
        }[];
    } & {
        id: string;
        name: string;
        sortOrder: number;
        slug: string;
    })[]>;
    getItems(category?: string, type?: MediaType, isSlideshow?: boolean, page?: string, limit?: string): Promise<{
        items: ({
            category: {
                id: string;
                name: string;
                sortOrder: number;
                slug: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            sortOrder: number;
            altText: string;
            categoryId: string;
            mediaType: import(".prisma/client").$Enums.MediaType;
            mediaUrl: string;
            thumbnailUrl: string | null;
            caption: string | null;
            isSlideshow: boolean;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    upsertCategory(data: any): Promise<{
        id: string;
        name: string;
        sortOrder: number;
        slug: string;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        sortOrder: number;
        slug: string;
    }>;
    upsertItem(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        altText: string;
        categoryId: string;
        mediaType: import(".prisma/client").$Enums.MediaType;
        mediaUrl: string;
        thumbnailUrl: string | null;
        caption: string | null;
        isSlideshow: boolean;
    }>;
    deleteItem(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        altText: string;
        categoryId: string;
        mediaType: import(".prisma/client").$Enums.MediaType;
        mediaUrl: string;
        thumbnailUrl: string | null;
        caption: string | null;
        isSlideshow: boolean;
    }>;
    toggleSlideshow(id: string, isSlideshow: boolean): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        altText: string;
        categoryId: string;
        mediaType: import(".prisma/client").$Enums.MediaType;
        mediaUrl: string;
        thumbnailUrl: string | null;
        caption: string | null;
        isSlideshow: boolean;
    }>;
    getSlideshowFiles(): Promise<string[]>;
    uploadSlideshowFiles(files: Express.Multer.File[]): Promise<{
        uploaded: string[];
    }>;
    renameSlideshowFile(data: {
        oldName: string;
        newName: string;
    }): Promise<{
        success: boolean;
        newUrl: string;
    }>;
    deleteSlideshowFile(filename: string): Promise<{
        success: boolean;
    }>;
    getGalleryFolders(): Promise<{
        folder: string;
        label: string;
        count: number;
    }[]>;
    createGalleryFolder(name: string): Promise<{
        success: boolean;
    }>;
    renameGalleryFolder(oldName: string, newName: string): Promise<{
        success: boolean;
    }>;
    deleteGalleryFolder(folder: string): Promise<{
        success: boolean;
    }>;
    getGalleryFiles(folder: string): Promise<string[]>;
    uploadGalleryFiles(folder: string, files: Express.Multer.File[]): Promise<{
        uploaded: string[];
    }>;
    renameGalleryFile(data: {
        folder: string;
        oldName: string;
        newName: string;
    }): Promise<{
        success: boolean;
        newUrl: string;
    }>;
    deleteGalleryFile(folder: string, filename: string): Promise<{
        success: boolean;
    }>;
}
