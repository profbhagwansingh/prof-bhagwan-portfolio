import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getProfile(req: any): Promise<{
        email: string;
        fullName: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
        createdAt: Date;
    } | null>;
}
