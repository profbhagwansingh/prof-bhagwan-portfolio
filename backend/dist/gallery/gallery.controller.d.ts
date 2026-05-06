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
        }[];
    } & {
        id: string;
        name: string;
        sortOrder: number;
        slug: string;
    })[]>;
    getItems(category?: string, type?: MediaType, page?: string, limit?: string): Promise<{
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
    }>;
}
