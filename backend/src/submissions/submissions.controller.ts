import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmissionsService } from './submissions.service';
import { Role, SubmissionStatus, AlumniStatus } from '@prisma/client';

@Controller('api/submissions')
export class SubmissionsController {
    constructor(private subService: SubmissionsService) { }

    // ─── PUBLIC: Submit forms (rate-limited) ───────────────
    @Post('contact')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    createContact(@Body() data: { name: string; email: string; whatsapp?: string; message: string }) {
        return this.subService.createContact(data);
    }

    @Post('alumni')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UseInterceptors(FileInterceptor('picture', { limits: { fileSize: 5 * 1024 * 1024 } }))
    createAlumni(@Body() data: any, @UploadedFile() file?: any) {
        // Parse batchYear from string to integer (multipart sends strings)
        if (data.batchYear) {
            data.batchYear = parseInt(data.batchYear, 10) || null;
        }
        return this.subService.createAlumni(data, file);
    }


    // ─── ADMIN: View & manage submissions ─────────────────
    @Get('admin/contacts')
    @UseGuards(AuthGuard('jwt'))
    getContacts(@Query('status') status?: SubmissionStatus, @Query('page') page?: string) {
        return this.subService.getContacts(status, +(page || 1));
    }

    @Patch('admin/contacts/:id/status')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    updateContactStatus(@Param('id') id: string, @Body('status') status: SubmissionStatus) {
        return this.subService.updateContactStatus(id, status);
    }

    @Delete('admin/contacts/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteContact(@Param('id') id: string) { return this.subService.deleteContact(id); }

    @Get('admin/alumni')
    @UseGuards(AuthGuard('jwt'))
    getAlumni(@Query('status') status?: AlumniStatus, @Query('page') page?: string) {
        return this.subService.getAlumni(status, +(page || 1));
    }

    @Patch('admin/alumni/:id/status')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    updateAlumniStatus(@Param('id') id: string, @Body('status') status: AlumniStatus) {
        return this.subService.updateAlumniStatus(id, status);
    }

    @Delete('admin/alumni/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    deleteAlumni(@Param('id') id: string) { return this.subService.deleteAlumni(id); }

    @Get('admin/stats')
    @UseGuards(AuthGuard('jwt'))
    getStats() { return this.subService.getDashboardStats(); }
}
