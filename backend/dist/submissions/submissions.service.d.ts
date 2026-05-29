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
        email: string;
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        whatsapp: string | null;
        message: string;
    }>;
    getContacts(status?: SubmissionStatus, page?: number, limit?: number): Promise<{
        items: {
            email: string;
            id: string;
            createdAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.SubmissionStatus;
            whatsapp: string | null;
            message: string;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    updateContactStatus(id: string, status: SubmissionStatus): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        whatsapp: string | null;
        message: string;
    }>;
    deleteContact(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        whatsapp: string | null;
        message: string;
    }>;
    createAlumni(data: any): Promise<{
        email: string;
        fullName: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AlumniStatus;
        whatsapp: string | null;
        message: string | null;
        teachingMode: string | null;
        degreeProgram: string | null;
        institute: string | null;
        batchYear: number | null;
        rollNumber: string | null;
        pictureUrl: string | null;
    }>;
    getAlumni(status?: AlumniStatus, page?: number, limit?: number): Promise<{
        items: {
            email: string;
            fullName: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.AlumniStatus;
            whatsapp: string | null;
            message: string | null;
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
        email: string;
        fullName: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AlumniStatus;
        whatsapp: string | null;
        message: string | null;
        teachingMode: string | null;
        degreeProgram: string | null;
        institute: string | null;
        batchYear: number | null;
        rollNumber: string | null;
        pictureUrl: string | null;
    }>;
    deleteAlumni(id: string): Promise<{
        email: string;
        fullName: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AlumniStatus;
        whatsapp: string | null;
        message: string | null;
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
