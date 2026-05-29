import { PrismaService } from '../prisma/prisma.service';
export declare class PublicationsService {
    private prisma;
    constructor(prisma: PrismaService);
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
