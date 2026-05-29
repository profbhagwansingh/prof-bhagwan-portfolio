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
    getItems(categorySlug?: string, mediaType?: MediaType, isSlideshow?: boolean, page?: number, limit?: number): Promise<{
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
