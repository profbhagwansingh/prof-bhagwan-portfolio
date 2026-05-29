import { PublicationsService } from './publications.service';
export declare class PublicationsController {
    private pubService;
    constructor(pubService: PublicationsService);
    getPublications(tag?: string): Promise<{
        id: string;
        title: string;
        journal: string | null;
        year: number;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    getBooks(): Promise<{
        id: string;
        title: string;
        year: number;
        sortOrder: number;
        isActive: boolean;
        subtitle: string | null;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }[]>;
    getAllPublications(): Promise<{
        id: string;
        title: string;
        journal: string | null;
        year: number;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    upsertPublication(data: any): Promise<{
        id: string;
        title: string;
        journal: string | null;
        year: number;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    deletePublication(id: string): Promise<{
        id: string;
        title: string;
        journal: string | null;
        year: number;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    upsertBook(data: any): Promise<{
        id: string;
        title: string;
        year: number;
        sortOrder: number;
        isActive: boolean;
        subtitle: string | null;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }>;
    deleteBook(id: string): Promise<{
        id: string;
        title: string;
        year: number;
        sortOrder: number;
        isActive: boolean;
        subtitle: string | null;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }>;
}
