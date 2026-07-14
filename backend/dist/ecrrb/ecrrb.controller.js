"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrrbController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const client_1 = require("@prisma/client");
const ecrrb_service_1 = require("./ecrrb.service");
let EcrrbController = class EcrrbController {
    constructor(ecrrbService) {
        this.ecrrbService = ecrrbService;
    }
    async submitApplication(body, files) {
        const data = typeof body.data === 'string' ? JSON.parse(body.data) : body;
        return this.ecrrbService.processApplication(data, files);
    }
    async getAllApplications() {
        return this.ecrrbService.getAllApplications();
    }
    async getApplicationDetails(id) {
        return this.ecrrbService.getApplicationDetails(id);
    }
    async deleteApplication(id) {
        return this.ecrrbService.deleteApplication(id);
    }
    async submitCertification(body, files) {
        const data = typeof body.data === 'string' ? JSON.parse(body.data) : body;
        return this.ecrrbService.processCertification(data, files);
    }
    async getAllCertifications() {
        return this.ecrrbService.getAllCertifications();
    }
    async getCertificationDetails(id) {
        return this.ecrrbService.getCertificationDetails(id);
    }
    async deleteCertification(id) {
        return this.ecrrbService.deleteCertification(id);
    }
};
exports.EcrrbController = EcrrbController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'photo', maxCount: 1 },
        { name: 'cv', maxCount: 1 },
        { name: 'scopusExport', maxCount: 1 },
        { name: 'papers', maxCount: 3 },
        { name: 'certificate', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EcrrbController.prototype, "submitApplication", null);
__decorate([
    (0, common_1.Get)('admin/applications'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcrrbController.prototype, "getAllApplications", null);
__decorate([
    (0, common_1.Get)('admin/applications/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcrrbController.prototype, "getApplicationDetails", null);
__decorate([
    (0, common_1.Delete)('admin/applications/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcrrbController.prototype, "deleteApplication", null);
__decorate([
    (0, common_1.Post)('certification/apply'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'protocol', maxCount: 1 },
        { name: 'icf', maxCount: 1 },
        { name: 'tools', maxCount: 5 },
        { name: 'piCv', maxCount: 1 },
        { name: 'researchPaper', maxCount: 1 },
        { name: 'priorApproval', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EcrrbController.prototype, "submitCertification", null);
__decorate([
    (0, common_1.Get)('admin/certifications'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcrrbController.prototype, "getAllCertifications", null);
__decorate([
    (0, common_1.Get)('admin/certifications/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcrrbController.prototype, "getCertificationDetails", null);
__decorate([
    (0, common_1.Delete)('admin/certifications/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcrrbController.prototype, "deleteCertification", null);
exports.EcrrbController = EcrrbController = __decorate([
    (0, common_1.Controller)('api/ecrrb'),
    __metadata("design:paramtypes", [ecrrb_service_1.EcrrbService])
], EcrrbController);
//# sourceMappingURL=ecrrb.controller.js.map