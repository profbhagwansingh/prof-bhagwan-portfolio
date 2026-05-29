import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';

@Controller('api/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * GET /api/users — List all admin users.
   * Restricted to SUPER_ADMIN only.
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /api/users/:id — Get a single user by ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * POST /api/users — Create a new admin user.
   * Rate limited to 5 per minute.
   */
  @Post()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  create(
    @Body()
    data: {
      email: string;
      fullName: string;
      password: string;
      role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
    },
  ) {
    return this.usersService.create(data);
  }

  /**
   * PUT /api/users/:id — Update user details.
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    data: {
      fullName?: string;
      role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
      isActive?: boolean;
    },
  ) {
    return this.usersService.update(id, data);
  }

  /**
   * PUT /api/users/:id/password — Change a user's password.
   */
  @Put(':id/password')
  changePassword(
    @Param('id') id: string,
    @Body() data: { newPassword: string },
  ) {
    return this.usersService.changePassword(id, data.newPassword);
  }

  /**
   * DELETE /api/users/:id — Delete a user.
   */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
