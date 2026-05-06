import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { GalleryService } from './gallery.service';
import { Role, MediaType } from '@prisma/client';

@Controller('api/gallery')
export class GalleryController {
    constructor(private galleryService: GalleryService) { }

    @Get('categories')
    getCategories() { return this.galleryService.getCategories(); }

    @Get('items')
    getItems(
        @Query('category') category?: string,
        @Query('type') type?: MediaType,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.galleryService.getItems(category, type, +(page || 1), +(limit || 20));
    }

    @Post('admin/categories')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    upsertCategory(@Body() data: any) { return this.galleryService.upsertCategory(data); }

    @Delete('admin/categories/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteCategory(@Param('id') id: string) { return this.galleryService.deleteCategory(id); }

    @Post('admin/items')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    upsertItem(@Body() data: any) { return this.galleryService.upsertItem(data); }

    @Delete('admin/items/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteItem(@Param('id') id: string) { return this.galleryService.deleteItem(id); }
}
