import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { ContentService } from './content.service';
import { Role } from '@prisma/client';

@Controller('api/content')
export class ContentController {
    constructor(private contentService: ContentService) { }

    // ═══════════════════════════════════════════════════════
    //  PUBLIC ENDPOINTS (No Auth)
    // ═══════════════════════════════════════════════════════

    @Get('hero')
    getHero() { return this.contentService.getHeroSections(); }

    @Get('about')
    getAbout() { return this.contentService.getAboutContent(); }

    @Get('timeline')
    getTimeline() { return this.contentService.getTimeline(); }

    @Get('courses')
    getCourses() { return this.contentService.getCourses(); }

    @Get('achievements')
    getAchievements() { return this.contentService.getAchievements(); }

    @Get('scholars')
    getScholars() { return this.contentService.getScholars(); }

    @Get('announcements')
    getAnnouncements() { return this.contentService.getAnnouncements(); }

    @Get('social-links')
    getSocialLinks() { return this.contentService.getSocialLinks(); }

    // ═══════════════════════════════════════════════════════
    //  ADMIN ENDPOINTS (Authenticated + Role-gated)
    // ═══════════════════════════════════════════════════════

    @Post('admin/hero')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    upsertHero(@Body() data: any) { return this.contentService.upsertHeroSection(data); }

    @Post('admin/hero/image')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    addHeroImage(@Body() data: { heroSectionId: string; imageUrl: string; altText?: string }) {
        return this.contentService.addHeroImage(data.heroSectionId, data.imageUrl, data.altText);
    }

    @Delete('admin/hero/image/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteHeroImage(@Param('id') id: string) { return this.contentService.deleteHeroImage(id); }

    @Get('admin/about')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    getAdminAbout() { return this.contentService.getAboutContent(); } // can be updated to getAll if needed

    @Post('admin/about')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    upsertAbout(@Body() data: any) { return this.contentService.upsertAboutContent(data); }

    @Get('admin/timeline')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    getAdminTimeline() { return this.contentService.getAllTimeline(); }

    @Post('admin/timeline')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    upsertTimeline(@Body() data: any) { return this.contentService.upsertTimeline(data); }

    @Delete('admin/timeline/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteTimeline(@Param('id') id: string) { return this.contentService.deleteTimeline(id); }

    @Post('admin/courses')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    upsertCourse(@Body() data: any) { return this.contentService.upsertCourse(data); }

    @Delete('admin/courses/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteCourse(@Param('id') id: string) { return this.contentService.deleteCourse(id); }

    @Post('admin/achievements')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    upsertAchievement(@Body() data: any) { return this.contentService.upsertAchievement(data); }

    @Delete('admin/achievements/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteAchievement(@Param('id') id: string) { return this.contentService.deleteAchievement(id); }

    @Post('admin/scholars')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    upsertScholar(@Body() data: any) { return this.contentService.upsertScholar(data); }

    @Delete('admin/scholars/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteScholar(@Param('id') id: string) { return this.contentService.deleteScholar(id); }

    @Post('admin/announcements')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
    upsertAnnouncement(@Body() data: any) { return this.contentService.upsertAnnouncement(data); }

    @Delete('admin/announcements/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteAnnouncement(@Param('id') id: string) { return this.contentService.deleteAnnouncement(id); }

    @Post('admin/social-links')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    upsertSocialLink(@Body() data: any) { return this.contentService.upsertSocialLink(data); }

    @Delete('admin/social-links/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteSocialLink(@Param('id') id: string) { return this.contentService.deleteSocialLink(id); }
}
