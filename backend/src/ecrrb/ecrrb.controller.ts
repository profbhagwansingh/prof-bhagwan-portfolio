import 'multer';
import { Controller, Post, Get, Delete, Param, Body, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { Role } from '@prisma/client';
import { EcrrbService } from './ecrrb.service';

@Controller('api/ecrrb')
export class EcrrbController {
  constructor(private readonly ecrrbService: EcrrbService) {}

  @Post('apply')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photo', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'scopusExport', maxCount: 1 },
    { name: 'papers', maxCount: 3 },
    { name: 'certificate', maxCount: 1 },
  ]))
  async submitApplication(
    @Body() body: any,
    @UploadedFiles() files: any
  ) {
    // Parse JSON fields if they are sent as strings
    const data = typeof body.data === 'string' ? JSON.parse(body.data) : body;
    
    return this.ecrrbService.processApplication(data, files);
  }

  // --- Admin Routes ---
  
  @Get('admin/applications')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getAllApplications() {
    return this.ecrrbService.getAllApplications();
  }

  @Get('admin/applications/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getApplicationDetails(@Param('id') id: string) {
    return this.ecrrbService.getApplicationDetails(id);
  }

  @Delete('admin/applications/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async deleteApplication(@Param('id') id: string) {
    return this.ecrrbService.deleteApplication(id);
  }

  // --- Certification Routes ---

  @Post('certification/apply')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'protocol', maxCount: 1 },
    { name: 'icf', maxCount: 1 },
    { name: 'tools', maxCount: 5 },
    { name: 'piCv', maxCount: 1 },
    { name: 'researchPaper', maxCount: 1 },
    { name: 'priorApproval', maxCount: 1 },
  ]))
  async submitCertification(
    @Body() body: any,
    @UploadedFiles() files: any
  ) {
    const data = typeof body.data === 'string' ? JSON.parse(body.data) : body;
    return this.ecrrbService.processCertification(data, files);
  }

  @Get('admin/certifications')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getAllCertifications() {
    return this.ecrrbService.getAllCertifications();
  }

  @Get('admin/certifications/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getCertificationDetails(@Param('id') id: string) {
    return this.ecrrbService.getCertificationDetails(id);
  }

  @Delete('admin/certifications/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async deleteCertification(@Param('id') id: string) {
    return this.ecrrbService.deleteCertification(id);
  }
}
