import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(category?: string): Promise<{
        id: string;
        updatedAt: Date;
        category: string;
        key: string;
        value: string;
    }[]>;
    getSetting(key: string): Promise<{
        id: string;
        updatedAt: Date;
        category: string;
        key: string;
        value: string;
    }>;
    upsertSetting(key: string, value: string, category?: string): Promise<{
        id: string;
        updatedAt: Date;
        category: string;
        key: string;
        value: string;
    }>;
    getSeoForPage(pageSlug: string): Promise<{
        id: string;
        updatedAt: Date;
        pageSlug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        ogTitle: string | null;
        ogDescription: string | null;
        ogImage: string | null;
        canonicalUrl: string | null;
        structuredData: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getAllSeo(): Promise<{
        id: string;
        updatedAt: Date;
        pageSlug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        ogTitle: string | null;
        ogDescription: string | null;
        ogImage: string | null;
        canonicalUrl: string | null;
        structuredData: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    upsertSeo(data: any): Promise<{
        id: string;
        updatedAt: Date;
        pageSlug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        ogTitle: string | null;
        ogDescription: string | null;
        ogImage: string | null;
        canonicalUrl: string | null;
        structuredData: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    createAuditLog(data: {
        userId?: string;
        action: string;
        entityType: string;
        entityId?: string;
        previousData?: any;
        newData?: any;
        ipAddress?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string | null;
        previousData: import("@prisma/client/runtime/library").JsonValue | null;
        newData: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userId: string | null;
    }>;
    getAuditLogs(page?: number, limit?: number): Promise<{
        items: ({
            user: {
                email: string;
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            action: string;
            entityType: string;
            entityId: string | null;
            previousData: import("@prisma/client/runtime/library").JsonValue | null;
            newData: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
