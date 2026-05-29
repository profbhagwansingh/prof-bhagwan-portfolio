import { PrismaService } from '../prisma/prisma.service';
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    getHeroSections(): Promise<({
        images: {
            id: string;
            sortOrder: number;
            altText: string;
            heroSectionId: string;
            imageUrl: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
    })[]>;
    upsertHeroSection(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
    }>;
    addHeroImage(heroSectionId: string, imageUrl: string, altText?: string): Promise<{
        id: string;
        sortOrder: number;
        altText: string;
        heroSectionId: string;
        imageUrl: string;
    }>;
    deleteHeroImage(id: string): Promise<{
        id: string;
        sortOrder: number;
        altText: string;
        heroSectionId: string;
        imageUrl: string;
    }>;
    getAboutContent(): Promise<{
        id: string;
        isActive: boolean;
        updatedAt: Date;
        content: string;
        sortOrder: number;
        title: string;
        imageUrl: string | null;
        sectionKey: string;
    }[]>;
    upsertAboutContent(data: any): Promise<{
        id: string;
        isActive: boolean;
        updatedAt: Date;
        content: string;
        sortOrder: number;
        title: string;
        imageUrl: string | null;
        sectionKey: string;
    }>;
    getTimeline(): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        organization: string;
        location: string | null;
        dateRange: string;
        externalLink: string | null;
    }[]>;
    getAllTimeline(): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        organization: string;
        location: string | null;
        dateRange: string;
        externalLink: string | null;
    }[]>;
    upsertTimeline(data: any): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        organization: string;
        location: string | null;
        dateRange: string;
        externalLink: string | null;
    }>;
    deleteTimeline(id: string): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        organization: string;
        location: string | null;
        dateRange: string;
        externalLink: string | null;
    }>;
    getCourses(): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        category: string;
        sortOrder: number;
        syllabusUrl: string | null;
    }[]>;
    upsertCourse(data: any): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        category: string;
        sortOrder: number;
        syllabusUrl: string | null;
    }>;
    deleteCourse(id: string): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        category: string;
        sortOrder: number;
        syllabusUrl: string | null;
    }>;
    getAchievements(): Promise<{
        id: string;
        isActive: boolean;
        category: string;
        sortOrder: number;
        title: string;
        year: number | null;
        description: string;
    }[]>;
    upsertAchievement(data: any): Promise<{
        id: string;
        isActive: boolean;
        category: string;
        sortOrder: number;
        title: string;
        year: number | null;
        description: string;
    }>;
    deleteAchievement(id: string): Promise<{
        id: string;
        isActive: boolean;
        category: string;
        sortOrder: number;
        title: string;
        year: number | null;
        description: string;
    }>;
    getScholars(): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        status: import(".prisma/client").$Enums.ScholarStatus;
        sortOrder: number;
        imageUrl: string | null;
        researchTopic: string | null;
        currentPosition: string | null;
    }[]>;
    upsertScholar(data: any): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        status: import(".prisma/client").$Enums.ScholarStatus;
        sortOrder: number;
        imageUrl: string | null;
        researchTopic: string | null;
        currentPosition: string | null;
    }>;
    deleteScholar(id: string): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        status: import(".prisma/client").$Enums.ScholarStatus;
        sortOrder: number;
        imageUrl: string | null;
        researchTopic: string | null;
        currentPosition: string | null;
    }>;
    getAnnouncements(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        content: string;
        title: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
    }[]>;
    upsertAnnouncement(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        content: string;
        title: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
    }>;
    deleteAnnouncement(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        content: string;
        title: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
    }>;
    getSocialLinks(): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        platform: string;
        url: string;
        iconSvg: string | null;
    }[]>;
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
