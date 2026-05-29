import { PrismaService } from '../prisma/prisma.service';
import { MediaType } from '@prisma/client';
export declare class GalleryService {
    private prisma;
    private readonly logger;
    private readonly mediaRoot;
    constructor(prisma: PrismaService);
    getCategories(): Promise<({
        items: {
            id: string;
            sortOrder: number;
            isActive: boolean;
            categoryId: string;
            mediaType: import(".prisma/client").$Enums.MediaType;
            mediaUrl: string;
            thumbnailUrl: string | null;
            caption: string | null;
            altText: string;
            isSlideshow: boolean;
            createdAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        sortOrder: number;
    })[]>;
    upsertCategory(data: any): Promise<{
        id: string;
        name: string;
        slug: string;
        sortOrder: number;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        sortOrder: number;
    }>;
    getItems(categorySlug?: string, mediaType?: MediaType, isSlideshow?: boolean, page?: number, limit?: number): Promise<{
        items: ({
            category: {
                id: string;
                name: string;
                slug: string;
                sortOrder: number;
            };
        } & {
            id: string;
            sortOrder: number;
            isActive: boolean;
            categoryId: string;
            mediaType: import(".prisma/client").$Enums.MediaType;
            mediaUrl: string;
            thumbnailUrl: string | null;
            caption: string | null;
            altText: string;
            isSlideshow: boolean;
            createdAt: Date;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    upsertItem(data: any): Promise<{
        id: string;
        sortOrder: number;
        isActive: boolean;
        categoryId: string;
        mediaType: import(".prisma/client").$Enums.MediaType;
        mediaUrl: string;
        thumbnailUrl: string | null;
        caption: string | null;
        altText: string;
        isSlideshow: boolean;
        createdAt: Date;
    }>;
    deleteItem(id: string): Promise<{
        id: string;
        sortOrder: number;
        isActive: boolean;
        categoryId: string;
        mediaType: import(".prisma/client").$Enums.MediaType;
        mediaUrl: string;
        thumbnailUrl: string | null;
        caption: string | null;
        altText: string;
        isSlideshow: boolean;
        createdAt: Date;
    }>;
    toggleSlideshow(id: string, isSlideshow: boolean): Promise<{
        id: string;
        sortOrder: number;
        isActive: boolean;
        categoryId: string;
        mediaType: import(".prisma/client").$Enums.MediaType;
        mediaUrl: string;
        thumbnailUrl: string | null;
        caption: string | null;
        altText: string;
        isSlideshow: boolean;
        createdAt: Date;
    }>;
    private resolveDir;
    scanFiles(folder: string): Promise<string[]>;
    uploadFiles(folder: string, files: any[]): Promise<{
        uploaded: string[];
    }>;
    renameFile(folder: string, oldName: string, newName: string): Promise<{
        success: boolean;
        newUrl: string;
    }>;
    deleteFile(folder: string, filename: string): Promise<{
        success: boolean;
    }>;
    createFolder(folderName: string): Promise<{
        success: boolean;
    }>;
    renameFolder(oldName: string, newName: string): Promise<{
        success: boolean;
    }>;
    deleteFolder(folderName: string): Promise<{
        success: boolean;
    }>;
    scanGalleryFolders(): Promise<{
        folder: string;
        label: string;
        count: number;
    }[]>;
    scanSlideshowFiles(): Promise<string[]>;
    uploadSlideshowFiles(files: any[]): Promise<{
        uploaded: string[];
    }>;
    renameSlideshowFile(oldName: string, newName: string): Promise<{
        success: boolean;
        newUrl: string;
    }>;
    deleteSlideshowFile(filename: string): Promise<{
        success: boolean;
    }>;
}
