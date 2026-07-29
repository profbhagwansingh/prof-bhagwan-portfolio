import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
export declare class TestimonialsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTestimonialDto: CreateTestimonialDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        content: string;
        authorName: string;
        authorTitle: string | null;
        authorImage: string | null;
    }>;
    findAllAdmin(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        content: string;
        authorName: string;
        authorTitle: string | null;
        authorImage: string | null;
    }[]>;
    findAllPublic(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        content: string;
        authorName: string;
        authorTitle: string | null;
        authorImage: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        content: string;
        authorName: string;
        authorTitle: string | null;
        authorImage: string | null;
    }>;
    update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        content: string;
        authorName: string;
        authorTitle: string | null;
        authorImage: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        content: string;
        authorName: string;
        authorTitle: string | null;
        authorImage: string | null;
    }>;
}
