import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { MediaType } from '@prisma/client';
export declare class GalleryService {
    private prisma;
    private mediaService;
    private readonly logger;
    constructor(prisma: PrismaService, mediaService: MediaService);
    private normalizeSlug;
    private formatFolderName;
    private findOrCreateCategory;
    private ensureDefaultFolders;
    getCategories(): Promise<({
        items: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            sortOrder: number;
            categoryId: string;
            mediaType: import(".prisma/client").$Enums.MediaType;
            mediaUrl: string;
            publicId: string | null;
            thumbnailUrl: string | null;
            caption: string | null;
            altText: string;
            isPublic: boolean;
            isSlideshow: boolean;
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
            isActive: boolean;
            createdAt: Date;
            sortOrder: number;
            categoryId: string;
            mediaType: import(".prisma/client").$Enums.MediaType;
            mediaUrl: string;
            publicId: string | null;
            thumbnailUrl: string | null;
            caption: string | null;
            altText: string;
            isPublic: boolean;
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
        categoryId: string;
        mediaType: import(".prisma/client").$Enums.MediaType;
        mediaUrl: string;
        publicId: string | null;
        thumbnailUrl: string | null;
        caption: string | null;
        altText: string;
        isPublic: boolean;
        isSlideshow: boolean;
    }>;
    deleteItem(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        categoryId: string;
        mediaType: import(".prisma/client").$Enums.MediaType;
        mediaUrl: string;
        publicId: string | null;
        thumbnailUrl: string | null;
        caption: string | null;
        altText: string;
        isPublic: boolean;
        isSlideshow: boolean;
    }>;
    toggleSlideshow(id: string, isSlideshow: boolean): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        categoryId: string;
        mediaType: import(".prisma/client").$Enums.MediaType;
        mediaUrl: string;
        publicId: string | null;
        thumbnailUrl: string | null;
        caption: string | null;
        altText: string;
        isPublic: boolean;
        isSlideshow: boolean;
    }>;
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
    getPublicGalleryFolders(): Promise<{
        folder: string;
        label: string;
        count: number;
        sortOrder: number;
    }[]>;
    scanGalleryFolders(includeEmpty?: boolean): Promise<{
        folder: string;
        label: string;
        count: number;
        sortOrder: number;
    }[]>;
    private getFolderOrderMap;
    setFolderOrder(orderMap: Record<string, number>): Promise<{
        success: boolean;
    }>;
    getSlideshowOrder(): Promise<string[]>;
    setSlideshowOrder(order: string[]): Promise<{
        success: boolean;
    }>;
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
