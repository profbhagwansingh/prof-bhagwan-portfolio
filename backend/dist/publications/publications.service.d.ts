import { PrismaService } from '../prisma/prisma.service';
export declare class PublicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPublications(tag?: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        year: number;
        title: string;
        sortOrder: number;
        journal: string | null;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
    }[]>;
    getAllPublications(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        year: number;
        title: string;
        sortOrder: number;
        journal: string | null;
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
        year: number;
        title: string;
        sortOrder: number;
        journal: string | null;
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
        year: number;
        title: string;
        sortOrder: number;
        journal: string | null;
        tag: import(".prisma/client").$Enums.PublicationTag;
        authors: string | null;
        doi: string | null;
        externalUrl: string | null;
        abstractText: string | null;
    }>;
    getBooks(): Promise<{
        id: string;
        isActive: boolean;
        year: number;
        title: string;
        subtitle: string | null;
        sortOrder: number;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }[]>;
    upsertBook(data: any): Promise<{
        id: string;
        isActive: boolean;
        year: number;
        title: string;
        subtitle: string | null;
        sortOrder: number;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }>;
    deleteBook(id: string): Promise<{
        id: string;
        isActive: boolean;
        year: number;
        title: string;
        subtitle: string | null;
        sortOrder: number;
        coverImageUrl: string | null;
        purchaseUrl: string | null;
        isbn: string | null;
    }>;
}
