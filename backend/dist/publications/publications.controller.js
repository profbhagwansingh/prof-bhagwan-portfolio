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
exports.PublicationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const publications_service_1 = require("./publications.service");
const client_1 = require("@prisma/client");
let PublicationsController = class PublicationsController {
    pubService;
    constructor(pubService) {
        this.pubService = pubService;
    }
    getPublications(tag) { return this.pubService.getPublications(tag); }
    getBooks() { return this.pubService.getBooks(); }
    getAllPublications() { return this.pubService.getAllPublications(); }
    upsertPublication(data) { return this.pubService.upsertPublication(data); }
    deletePublication(id) { return this.pubService.deletePublication(id); }
    upsertBook(data) { return this.pubService.upsertBook(data); }
    deleteBook(id) { return this.pubService.deleteBook(id); }
};
exports.PublicationsController = PublicationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "getPublications", null);
__decorate([
    (0, common_1.Get)('books'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "getBooks", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "getAllPublications", null);
__decorate([
    (0, common_1.Post)('admin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN, client_1.Role.EDITOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "upsertPublication", null);
__decorate([
    (0, common_1.Delete)('admin/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "deletePublication", null);
__decorate([
    (0, common_1.Post)('admin/books'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN, client_1.Role.EDITOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "upsertBook", null);
__decorate([
    (0, common_1.Delete)('admin/books/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "deleteBook", null);
exports.PublicationsController = PublicationsController = __decorate([
    (0, common_1.Controller)('api/publications'),
    __metadata("design:paramtypes", [publications_service_1.PublicationsService])
], PublicationsController);
//# sourceMappingURL=publications.controller.js.map