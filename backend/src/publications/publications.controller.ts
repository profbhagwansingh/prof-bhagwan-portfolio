import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { PublicationsService } from './publications.service';
import { Role } from '@prisma/client';

@Controller('api/publications')
export class PublicationsController {
    constructor(private pubService: PublicationsService) { }

    @Get()
    getPublications(@Query('tag') tag?: string) { return this.pubService.getPublications(tag); }

    @Get('books')
    getBooks() { return this.pubService.getBooks(); }

    @Get('admin/all')
    @UseGuards(AuthGuard('jwt'))
    getAllPublications() { return this.pubService.getAllPublications(); }

    @Post('admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    upsertPublication(@Body() data: any) { return this.pubService.upsertPublication(data); }

    @Delete('admin/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deletePublication(@Param('id') id: string) { return this.pubService.deletePublication(id); }

    @Post('admin/books')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    upsertBook(@Body() data: any) { return this.pubService.upsertBook(data); }

    @Delete('admin/books/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteBook(@Param('id') id: string) { return this.pubService.deleteBook(id); }

    // ─── BOOK CHAPTERS ────────────────────────────────────────

    @Get('chapters')
    getBookChapters() { return this.pubService.getBookChapters(); }

    @Get('admin/chapters/all')
    @UseGuards(AuthGuard('jwt'))
    getAllBookChapters() { return this.pubService.getAllBookChapters(); }

    @Post('admin/chapters')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    upsertBookChapter(@Body() data: any) { return this.pubService.upsertBookChapter(data); }

    @Delete('admin/chapters/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteBookChapter(@Param('id') id: string) { return this.pubService.deleteBookChapter(id); }
}
