import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
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
    getSocialLinks(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        category: string;
    }[]>;
    getAllSettings(category?: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        category: string;
    }[]>;
    upsertSetting(data: {
        key: string;
        value: string;
        category?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        category: string;
    }>;
    updateSettings(data: {
        key: string;
        value: string;
        category?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        category: string;
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
    upsertSeoBySlug(pageSlug: string, data: any): Promise<{
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
    getAuditLogs(page?: string): Promise<{
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
