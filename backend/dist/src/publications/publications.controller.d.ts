import { PublicationsService } from './publications.service';
export declare class PublicationsController {
    private pubService;
    constructor(pubService: PublicationsService);
    getPublications(tag?: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        title: string;
        journal: string | null;
        year: number;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
    }[]>;
    getBooks(): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        title: string;
        year: number;
        subtitle: string | null;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }[]>;
    getAllPublications(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        title: string;
        journal: string | null;
        year: number;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
    }[]>;
    upsertPublication(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        title: string;
        journal: string | null;
        year: number;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
    }>;
    deletePublication(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        sortOrder: number;
        title: string;
        journal: string | null;
        year: number;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
    }>;
    upsertBook(data: any): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        title: string;
        year: number;
        subtitle: string | null;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }>;
    deleteBook(id: string): Promise<{
        id: string;
        isActive: boolean;
        sortOrder: number;
        title: string;
        year: number;
        subtitle: string | null;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }>;
}
