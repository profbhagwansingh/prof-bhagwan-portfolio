import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
    changePassword(id: string, data: {
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
