import { PrismaService } from '../prisma/prisma.service';
import { MediaType } from '@prisma/client';
export declare class GalleryService {
    private prisma;
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
    getItems(categorySlug?: string, mediaType?: MediaType, page?: number, limit?: number): Promise<{
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
