import { ContentService } from './content.service';
export declare class HomepageController {
    private contentService;
    constructor(contentService: ContentService);
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
}
