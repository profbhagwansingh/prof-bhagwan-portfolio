import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus, AlumniStatus } from '@prisma/client';
export declare class SubmissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createContact(data: {
        name: string;
        email: string;
        whatsapp?: string;
        message: string;
    }): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        whatsapp: string | null;
        message: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
    }>;
    getContacts(status?: SubmissionStatus, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            email: string;
            createdAt: Date;
            name: string;
            whatsapp: string | null;
            message: string;
            status: import(".prisma/client").$Enums.SubmissionStatus;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    updateContactStatus(id: string, status: SubmissionStatus): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        whatsapp: string | null;
        message: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
    }>;
    deleteContact(id: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        name: string;
        whatsapp: string | null;
        message: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
    }>;
    createAlumni(data: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        createdAt: Date;
        whatsapp: string | null;
        message: string | null;
        status: import(".prisma/client").$Enums.AlumniStatus;
        teachingMode: string | null;
        degreeProgram: string | null;
        institute: string | null;
        batchYear: number | null;
        rollNumber: string | null;
        pictureUrl: string | null;
    }>;
    getAlumni(status?: AlumniStatus, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            email: string;
            fullName: string;
            createdAt: Date;
            whatsapp: string | null;
            message: string | null;
            status: import(".prisma/client").$Enums.AlumniStatus;
            teachingMode: string | null;
            degreeProgram: string | null;
            institute: string | null;
            batchYear: number | null;
            rollNumber: string | null;
            pictureUrl: string | null;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    updateAlumniStatus(id: string, status: AlumniStatus): Promise<{
        id: string;
        email: string;
        fullName: string;
        createdAt: Date;
        whatsapp: string | null;
        message: string | null;
        status: import(".prisma/client").$Enums.AlumniStatus;
        teachingMode: string | null;
        degreeProgram: string | null;
        institute: string | null;
        batchYear: number | null;
        rollNumber: string | null;
        pictureUrl: string | null;
    }>;
    deleteAlumni(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        createdAt: Date;
        whatsapp: string | null;
        message: string | null;
        status: import(".prisma/client").$Enums.AlumniStatus;
        teachingMode: string | null;
        degreeProgram: string | null;
        institute: string | null;
        batchYear: number | null;
        rollNumber: string | null;
        pictureUrl: string | null;
    }>;
    getDashboardStats(): Promise<{
        contacts: {
            total: number;
            new: number;
        };
        alumni: {
            total: number;
            new: number;
        };
        publications: number;
        galleryItems: number;
        slideshowImages: number;
        courses: number;
        scholars: number;
        timeline: number;
        books: number;
        achievements: number;
        announcements: number;
        recentActivity: ({
            id: string;
            type: "contact";
            text: string;
            time: Date;
            status: import(".prisma/client").$Enums.SubmissionStatus;
        } | {
            id: string;
            type: "alumni";
            text: string;
            time: Date;
            status: import(".prisma/client").$Enums.AlumniStatus;
        })[];
    }>;
}
