import { ContentService } from './content.service';
export declare class ContentController {
    private contentService;
    constructor(contentService: ContentService);
    getHero(): Promise<({
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
    getAbout(): Promise<{
        id: string;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        title: string;
        imageUrl: string | null;
        sectionKey: string;
        content: string;
    }[]>;
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
    getCourses(): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        sortOrder: number;
        category: string;
        syllabusUrl: string | null;
    }[]>;
    getAchievements(): Promise<{
        id: string;
        isActive: boolean;
        year: number | null;
        sortOrder: number;
        category: string;
        title: string;
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
    getBooks(): Promise<{
        id: string;
        isActive: boolean;
        year: number;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
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
    getQuickStats(): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        label: string;
        count: string;
    }[]>;
    getInvitedLectures(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        category: string;
        title: string;
        slNo: number;
        conferenceDetails: string;
        lectureDate: Date | null;
    }[]>;
    upsertHero(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
    }>;
    addHeroImage(data: {
        heroSectionId: string;
        imageUrl: string;
        altText?: string;
    }): Promise<{
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
    getAdminAbout(): Promise<{
        id: string;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        title: string;
        imageUrl: string | null;
        sectionKey: string;
        content: string;
    }[]>;
    upsertAbout(data: any): Promise<{
        id: string;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        title: string;
        imageUrl: string | null;
        sectionKey: string;
        content: string;
    }>;
    getAdminTimeline(): Promise<{
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
    upsertCourse(data: any): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        sortOrder: number;
        category: string;
        syllabusUrl: string | null;
    }>;
    deleteCourse(id: string): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        sortOrder: number;
        category: string;
        syllabusUrl: string | null;
    }>;
    upsertAchievement(data: any): Promise<{
        id: string;
        isActive: boolean;
        year: number | null;
        sortOrder: number;
        category: string;
        title: string;
        description: string;
    }>;
    deleteAchievement(id: string): Promise<{
        id: string;
        isActive: boolean;
        year: number | null;
        sortOrder: number;
        category: string;
        title: string;
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
    upsertBook(data: any): Promise<{
        id: string;
        isActive: boolean;
        year: number;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }>;
    deleteBook(id: string): Promise<{
        id: string;
        isActive: boolean;
        year: number;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
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
    upsertQuickStat(data: any): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        label: string;
        count: string;
    }>;
    deleteQuickStat(id: string): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        label: string;
        count: string;
    }>;
    upsertInvitedLecture(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        category: string;
        title: string;
        slNo: number;
        conferenceDetails: string;
        lectureDate: Date | null;
    }>;
    deleteInvitedLecture(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        category: string;
        title: string;
        slNo: number;
        conferenceDetails: string;
        lectureDate: Date | null;
    }>;
}
