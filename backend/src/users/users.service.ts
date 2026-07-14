import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * List all users (admin-only). Excludes password hashes.
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a single user by ID (excludes password hash).
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Create a new admin user.
   */
  async create(data: {
    email: string;
    fullName: string;
    password: string;
    role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  }) {
    // Check for duplicate email
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(data.password, 12);

    return this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash,
        role: data.role ?? 'EDITOR',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  /**
   * Update user details (name, role, active status).
   * Password change is separate.
   */
  async update(
    id: string,
    data: {
      fullName?: string;
      role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
      isActive?: boolean;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Change a user's password (requires the new password).
   */
  async changePassword(id: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return { message: 'Password updated successfully' };
  }

  /**
   * Delete a user by ID.
   */
  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
