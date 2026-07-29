import { PrismaService } from '../prisma/prisma.service';
import { GalleryService } from '../gallery/gallery.service';
export declare class ContentService {
    private prisma;
    private galleryService;
    constructor(prisma: PrismaService, galleryService: GalleryService);
    getHomepageData(): Promise<{
        quickStats: {
            id: string;
            isActive: boolean;
            sortOrder: number;
            label: string;
            count: string;
        }[];
        courses: {
            id: string;
            isActive: boolean;
            name: string;
            sortOrder: number;
            category: string;
            syllabusUrl: string | null;
        }[];
        scholarsCount: number;
        invitedLecturesCount: number;
        publicationsCount: number;
        booksCount: number;
        bookChaptersCount: number;
        settings: {
            id: string;
            updatedAt: Date;
            category: string;
            key: string;
            value: string;
        }[];
        slideshow: string[];
    }>;
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
        sortOrder: number;
        title: string;
        imageUrl: string | null;
        sectionKey: string;
        content: string;
    }[]>;
    upsertAboutContent(data: any): Promise<{
        id: string;
        isActive: boolean;
        updatedAt: Date;
        sortOrder: number;
        title: string;
        imageUrl: string | null;
        sectionKey: string;
        content: string;
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
        sortOrder: number;
        category: string;
        syllabusUrl: string | null;
    }[]>;
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
    getAchievements(): Promise<{
        id: string;
        isActive: boolean;
        year: number | null;
        sortOrder: number;
        category: string;
        title: string;
        description: string;
    }[]>;
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
    getQuickStats(): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        label: string;
        count: string;
    }[]>;
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
}
