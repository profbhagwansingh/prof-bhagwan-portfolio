import { ContentService } from './content.service';
export declare class HomepageController {
    private contentService;
    constructor(contentService: ContentService);
    getHomepageData(): Promise<{
        quickStats: {
            id: string;
            isActive: boolean;
            label: string;
            count: string;
            sortOrder: number;
        }[];
        courses: {
            id: string;
            isActive: boolean;
            name: string;
            sortOrder: number;
            syllabusUrl: string | null;
            category: string;
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
