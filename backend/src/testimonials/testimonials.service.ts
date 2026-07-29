import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async create(createTestimonialDto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: createTestimonialDto,
    });
  }

  async findAllAdmin() {
    return this.prisma.testimonial.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findAllPublic() {
    return this.prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonial;
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto) {
    await this.findOne(id); // Check if exists
    return this.prisma.testimonial.update({
      where: { id },
      data: updateTestimonialDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists
    return this.prisma.testimonial.delete({
      where: { id },
    });
  }
}
