import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

import { RolesGuard, Roles } from '../auth/roles.guard';
import { GalleryService } from './gallery.service';
import { Role, MediaType } from '@prisma/client';

@Controller('api/gallery')
export class GalleryController {
    constructor(private galleryService: GalleryService) { }

    // ─── PUBLIC ──────────────────────────────────────────────
    @Get('categories')
    getCategories() { return this.galleryService.getCategories(); }

    @Get('items')
    getItems(
        @Query('category') category?: string,
        @Query('type') type?: MediaType,
        @Query('isSlideshow') isSlideshow?: boolean,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.galleryService.getItems(category, type, isSlideshow, +(page || 1), +(limit || 20));
    }

    // ─── ADMIN: DB ITEMS ─────────────────────────────────────
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

    @Patch('admin/items/:id/slideshow')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    toggleSlideshow(@Param('id') id: string, @Body('isSlideshow') isSlideshow: boolean) {
        return this.galleryService.toggleSlideshow(id, isSlideshow);
    }

    // ─── ADMIN: SLIDESHOW FILES ──────────────────────────────
    @Get('admin/slideshow-files')
    getSlideshowFiles() { return this.galleryService.scanSlideshowFiles(); }

    @Post('admin/slideshow-files/upload')
    @UseInterceptors(FilesInterceptor('files', 20))
    uploadSlideshowFiles(@UploadedFiles() files: Express.Multer.File[]) {
        return this.galleryService.uploadSlideshowFiles(files);
    }

    @Patch('admin/slideshow-files/rename')
    renameSlideshowFile(@Body() data: { oldName: string; newName: string }) {
        return this.galleryService.renameSlideshowFile(data.oldName, data.newName);
    }

    @Delete('admin/slideshow-files/:filename')
    deleteSlideshowFile(@Param('filename') filename: string) {
        return this.galleryService.deleteSlideshowFile(filename);
    }

    // ─── ADMIN: GALLERY FILES (any folder) ───────────────────
    @Get('admin/folders')
    getGalleryFolders() { return this.galleryService.scanGalleryFolders(); }

    @Post('admin/folders')
    createGalleryFolder(@Body('name') name: string) {
        return this.galleryService.createFolder(name);
    }

    @Patch('admin/folders/rename')
    renameGalleryFolder(@Body('oldName') oldName: string, @Body('newName') newName: string) {
        return this.galleryService.renameFolder(oldName, newName);
    }

    @Delete('admin/folders')
    deleteGalleryFolder(@Query('folder') folder: string) {
        return this.galleryService.deleteFolder(folder);
    }

    @Get('admin/files')
    getGalleryFiles(@Query('folder') folder: string) {
        return this.galleryService.scanFiles(folder);
    }

    @Post('admin/files/upload')
    @UseInterceptors(FilesInterceptor('files', 20))
    uploadGalleryFiles(@Query('folder') folder: string, @UploadedFiles() files: Express.Multer.File[]) {
        return this.galleryService.uploadFiles(folder, files);
    }

    @Patch('admin/files/rename')
    renameGalleryFile(@Body() data: { folder: string; oldName: string; newName: string }) {
        return this.galleryService.renameFile(data.folder, data.oldName, data.newName);
    }

    @Delete('admin/files/:filename')
    deleteGalleryFile(@Query('folder') folder: string, @Param('filename') filename: string) {
        return this.galleryService.deleteFile(folder, filename);
    }
}
