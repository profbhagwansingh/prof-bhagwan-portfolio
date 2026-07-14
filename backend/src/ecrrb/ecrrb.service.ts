import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import * as path from 'path';
import * as fs from 'fs';
import 'multer';

@Injectable()
export class EcrrbService {
  private readonly logger = new Logger(EcrrbService.name);

  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService,
  ) {}

  async processApplication(
    data: any,
    files: any,
  ) {
    try {
      // 1. Upload files
      let photoUrl = null;
      if (files.photo && files.photo.length > 0) {
        const result = await this.mediaService.saveFile(files.photo[0]);
        photoUrl = result.url;
      }

      let cvUrl = null;
      if (files.cv && files.cv.length > 0) {
        const result = await this.mediaService.saveFile(files.cv[0]);
        cvUrl = result.url;
      }

      let scopusExportUrl = null;
      if (files.scopusExport && files.scopusExport.length > 0) {
        const result = await this.mediaService.saveFile(files.scopusExport[0]);
        scopusExportUrl = result.url;
      }

      let certificateUrl = null;
      if (files.certificate && files.certificate.length > 0) {
        const result = await this.mediaService.saveFile(files.certificate[0]);
        certificateUrl = result.url;
      }

      const paperUrls: string[] = [];
      if (files.papers && files.papers.length > 0) {
        for (const paper of files.papers) {
          const result = await this.mediaService.saveFile(paper);
          paperUrls.push(result.url);
        }
      }

      // 2. Save to database
      const application = await this.prisma.ecrrbApplication.create({
        data: {
          fullName: data.fullName,
          dateOfBirth: new Date(data.dateOfBirth),
          photoUrl,
          designation: data.designation,
          affiliation: data.affiliation,
          email: data.email,
          phone: data.phone,
          address: data.address,
          category: data.category,
          highestQualification: data.highestQualification,
          specialization: data.specialization,
          yearsOfExperience: parseInt(data.yearsOfExperience) || 0,
          experienceSummary: data.experienceSummary,
          scopusId: data.scopusId || null,
          scopusLink: data.scopusLink || null,
          totalScopusPubs: data.totalScopusPubs ? parseInt(data.totalScopusPubs) : null,
          hIndex: data.hIndex ? parseInt(data.hIndex) : null,
          cvUrl,
          scopusExportUrl,
          paperUrls,
          hasEthicsTraining: data.hasEthicsTraining === 'true' || data.hasEthicsTraining === true,
          certificateUrl,
          digitalSignature: data.digitalSignature,
        },
      });

      // 3. Send Email (Mocked for now since nodemailer is not fully configured with SMTP)
      this.logger.log(`New ECRRB Application received from ${application.email}`);
      // TODO: Implement actual email sending via Nodemailer here when SMTP is provided

      return {
        success: true,
        message: 'Application submitted successfully',
        applicationId: application.id,
      };
    } catch (error) {
      this.logger.error('Failed to process application:', error);
      throw error;
    }
  }

  async getAllApplications() {
    return this.prisma.ecrrbApplication.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        category: true,
        createdAt: true,
      }
    });
  }

  async getApplicationDetails(id: string) {
    const application = await this.prisma.ecrrbApplication.findUnique({
      where: { id }
    });
    if (!application) throw new Error("Application not found");
    return application;
  }

  async deleteApplication(id: string) {
    return this.prisma.ecrrbApplication.delete({
      where: { id }
    });
  }

  // --- Certification Logic ---

  async processCertification(data: any, files: any) {
    try {
      // Handle file uploads (save locally for now)
      const saveFile = (fileArray: any[] | undefined) => {
        if (!fileArray || fileArray.length === 0) return null;
        const file = fileArray[0];
        const uploadDir = path.join(process.cwd(), 'uploads', 'ecrrb-certifications');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        return `/uploads/ecrrb-certifications/${fileName}`;
      };

      const protocolUrl = saveFile(files.protocol);
      const icfUrl = saveFile(files.icf);
      const piCvUrl = saveFile(files.piCv);
      const researchPaperUrl = saveFile(files.researchPaper);
      const priorApprovalUrl = saveFile(files.priorApproval);
      
      const toolUrls: string[] = [];
      if (files.tools) {
        for (const file of files.tools) {
          const uploadDir = path.join(process.cwd(), 'uploads', 'ecrrb-certifications');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, file.buffer);
          toolUrls.push(`/uploads/ecrrb-certifications/${fileName}`);
        }
      }

      const certification = await this.prisma.ecrrbCertification.create({
        data: {
          piName: data.piName,
          piDesignation: data.piDesignation,
          piInstitution: data.piInstitution,
          piEmail: data.piEmail,
          piPhone: data.piPhone,
          coInvestigators: data.coInvestigators || null,
          orcidScopusId: data.orcidScopusId || null,
          
          studyTitle: data.studyTitle,
          submissionType: data.submissionType,
          researchType: data.researchType,
          startDate: new Date(data.startDate),
          duration: data.duration,
          studySites: data.studySites || null,
          journalName: data.journalName || null,
          
          objectives: data.objectives,
          methodology: data.methodology,
          studyPopulation: data.studyPopulation,
          sampleSize: parseInt(data.sampleSize, 10),
          inclusionExclusion: data.inclusionExclusion || null,
          vulnerable: data.vulnerable,
          vulnerableSafeguards: data.vulnerableSafeguards || null,
          
          risks: data.risks,
          benefits: data.benefits,
          consentProcess: data.consentProcess,
          confidentiality: data.confidentiality,
          compensation: data.compensation || null,
          
          isFunded: data.isFunded,
          fundingAgency: data.fundingAgency || null,
          coiDeclared: data.coiDeclared === true || data.coiDeclared === 'true',
          
          protocolUrl,
          icfUrl,
          toolUrls,
          piCvUrl,
          researchPaperUrl,
          priorApprovalUrl,
          
          dec1: data.dec1 === true || data.dec1 === 'true',
          dec2: data.dec2 === true || data.dec2 === 'true',
          dec3: data.dec3 === true || data.dec3 === 'true',
          digitalSignature: data.digitalSignature,
          applicationDate: new Date(data.applicationDate),
        },
      });

      return {
        success: true,
        message: 'Certification application submitted successfully',
        applicationId: certification.id,
      };
    } catch (error) {
      this.logger.error('Failed to process certification application:', error);
      throw error;
    }
  }

  async getAllCertifications() {
    return this.prisma.ecrrbCertification.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        piName: true,
        studyTitle: true,
        piEmail: true,
        submissionType: true,
        createdAt: true,
      }
    });
  }

  async getCertificationDetails(id: string) {
    const certification = await this.prisma.ecrrbCertification.findUnique({
      where: { id }
    });
    if (!certification) throw new Error("Certification application not found");
    return certification;
  }

  async deleteCertification(id: string) {
    return this.prisma.ecrrbCertification.delete({
      where: { id }
    });
  }
}
