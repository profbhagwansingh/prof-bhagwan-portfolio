import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
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
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, data: {
        fullName?: string;
        role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
        isActive?: boolean;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
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
