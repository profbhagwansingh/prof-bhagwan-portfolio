import { Controller, Get, Post, Put, Body, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { SettingsService } from './settings.service';
import { Role } from '@prisma/client';

@Controller('api/settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) { }

    // ─── PUBLIC: SEO data for pages ────────────────────────
    @Get('seo/:pageSlug')
    getSeoForPage(@Param('pageSlug') pageSlug: string) {
        return this.settingsService.getSeoForPage(pageSlug);
    }

    // ─── PUBLIC: Social links ──────────────────────────────
    @Get('social-links')
    getSocialLinks() {
        return this.settingsService.getSettings('social');
    }

    // ─── ADMIN ────────────────────────────────────────────
    @Get('admin/all')
    @UseGuards(AuthGuard('jwt'))
    getAllSettings(@Query('category') category?: string) {
        return this.settingsService.getSettings(category);
    }

    @Post('admin/upsert')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    upsertSetting(@Body() data: { key: string; value: string; category?: string }) {
        return this.settingsService.upsertSetting(data.key, data.value, data.category);
    }

    @Put('admin/settings')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    updateSettings(@Body() data: { key: string; value: string; category?: string }) {
        return this.settingsService.upsertSetting(data.key, data.value, data.category);
    }

    @Get('admin/seo')
    @UseGuards(AuthGuard('jwt'))
    getAllSeo() { return this.settingsService.getAllSeo(); }

    @Post('admin/seo')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    upsertSeo(@Body() data: any) { return this.settingsService.upsertSeo(data); }

    @Put('seo/:pageSlug')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    upsertSeoBySlug(@Param('pageSlug') pageSlug: string, @Body() data: any) {
        return this.settingsService.upsertSeo({ ...data, pageSlug });
    }

    @Get('admin/audit-logs')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    getAuditLogs(@Query('page') page?: string) {
        return this.settingsService.getAuditLogs(+(page || 1));
    }
}

