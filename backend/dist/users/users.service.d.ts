import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        fullName: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        fullName: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: {
        email: string;
        fullName: string;
        password: string;
        role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
    }): Promise<{
        email: string;
        fullName: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, data: {
        fullName?: string;
        role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
        isActive?: boolean;
    }): Promise<{
        email: string;
        fullName: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        updatedAt: Date;
    }>;
    changePassword(id: string, newPassword: string): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
