import { ContentService } from './content.service';
export declare class ContentController {
    private contentService;
    constructor(contentService: ContentService);
    getHero(): Promise<({
        images: {
            id: string;
            sortOrder: number;
            imageUrl: string;
            altText: string;
            heroSectionId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        title: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
        sortOrder: number;
    })[]>;
    getAbout(): Promise<{
        id: string;
        isActive: boolean;
        updatedAt: Date;
        title: string;
        sortOrder: number;
        imageUrl: string | null;
        sectionKey: string;
        content: string;
    }[]>;
    getTimeline(): Promise<{
        id: string;
        isActive: boolean;
        title: string;
        subtitle: string | null;
        sortOrder: number;
        organization: string;
        location: string | null;
        dateRange: string;
        externalLink: string | null;
    }[]>;
    getCourses(): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        sortOrder: number;
        syllabusUrl: string | null;
        category: string;
    }[]>;
    getAchievements(): Promise<{
        id: string;
        isActive: boolean;
        year: number | null;
        title: string;
        sortOrder: number;
        category: string;
        description: string;
    }[]>;
    getScholars(): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        sortOrder: number;
        imageUrl: string | null;
        status: import(".prisma/client").$Enums.ScholarStatus;
        researchTopic: string | null;
        currentPosition: string | null;
    }[]>;
    getAnnouncements(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        title: string;
        content: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
    }[]>;
    getSocialLinks(): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        platform: string;
        url: string;
        iconSvg: string | null;
    }[]>;
    upsertHero(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        title: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
        sortOrder: number;
    }>;
    addHeroImage(data: {
        heroSectionId: string;
        imageUrl: string;
        altText?: string;
    }): Promise<{
        id: string;
        sortOrder: number;
        imageUrl: string;
        altText: string;
        heroSectionId: string;
    }>;
    deleteHeroImage(id: string): Promise<{
        id: string;
        sortOrder: number;
        imageUrl: string;
        altText: string;
        heroSectionId: string;
    }>;
    getAdminAbout(): Promise<{
        id: string;
        isActive: boolean;
        updatedAt: Date;
        title: string;
        sortOrder: number;
        imageUrl: string | null;
        sectionKey: string;
        content: string;
    }[]>;
    upsertAbout(data: any): Promise<{
        id: string;
        isActive: boolean;
        updatedAt: Date;
        title: string;
        sortOrder: number;
        imageUrl: string | null;
        sectionKey: string;
        content: string;
    }>;
    getAdminTimeline(): Promise<{
        id: string;
        isActive: boolean;
        title: string;
        subtitle: string | null;
        sortOrder: number;
        organization: string;
        location: string | null;
        dateRange: string;
        externalLink: string | null;
    }[]>;
    upsertTimeline(data: any): Promise<{
        id: string;
        isActive: boolean;
        title: string;
        subtitle: string | null;
        sortOrder: number;
        organization: string;
        location: string | null;
        dateRange: string;
        externalLink: string | null;
    }>;
    deleteTimeline(id: string): Promise<{
        id: string;
        isActive: boolean;
        title: string;
        subtitle: string | null;
        sortOrder: number;
        organization: string;
        location: string | null;
        dateRange: string;
        externalLink: string | null;
    }>;
    upsertCourse(data: any): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        sortOrder: number;
        syllabusUrl: string | null;
        category: string;
    }>;
    deleteCourse(id: string): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        sortOrder: number;
        syllabusUrl: string | null;
        category: string;
    }>;
    upsertAchievement(data: any): Promise<{
        id: string;
        isActive: boolean;
        year: number | null;
        title: string;
        sortOrder: number;
        category: string;
        description: string;
    }>;
    deleteAchievement(id: string): Promise<{
        id: string;
        isActive: boolean;
        year: number | null;
        title: string;
        sortOrder: number;
        category: string;
        description: string;
    }>;
    upsertScholar(data: any): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        sortOrder: number;
        imageUrl: string | null;
        status: import(".prisma/client").$Enums.ScholarStatus;
        researchTopic: string | null;
        currentPosition: string | null;
    }>;
    deleteScholar(id: string): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        sortOrder: number;
        imageUrl: string | null;
        status: import(".prisma/client").$Enums.ScholarStatus;
        researchTopic: string | null;
        currentPosition: string | null;
    }>;
    upsertAnnouncement(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        title: string;
        content: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
    }>;
    deleteAnnouncement(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        title: string;
        content: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
    }>;
    upsertSocialLink(data: any): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        platform: string;
        url: string;
        iconSvg: string | null;
    }>;
    deleteSocialLink(id: string): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        platform: string;
        url: string;
        iconSvg: string | null;
    }>;
}
