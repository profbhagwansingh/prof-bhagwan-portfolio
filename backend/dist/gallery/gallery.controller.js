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
exports.GalleryController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const roles_guard_1 = require("../auth/roles.guard");
const gallery_service_1 = require("./gallery.service");
const client_1 = require("@prisma/client");
let GalleryController = class GalleryController {
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    getCategories() { return this.galleryService.getCategories(); }
    getItems(category, type, isSlideshow, page, limit) {
        return this.galleryService.getItems(category, type, isSlideshow, +(page || 1), +(limit || 20));
    }
    upsertCategory(data) { return this.galleryService.upsertCategory(data); }
    deleteCategory(id) { return this.galleryService.deleteCategory(id); }
    upsertItem(data) { return this.galleryService.upsertItem(data); }
    deleteItem(id) { return this.galleryService.deleteItem(id); }
    toggleSlideshow(id, isSlideshow) {
        return this.galleryService.toggleSlideshow(id, isSlideshow);
    }
    getSlideshowFiles() { return this.galleryService.scanSlideshowFiles(); }
    uploadSlideshowFiles(files) {
        return this.galleryService.uploadSlideshowFiles(files);
    }
    renameSlideshowFile(data) {
        return this.galleryService.renameSlideshowFile(data.oldName, data.newName);
    }
    deleteSlideshowFile(filename) {
        return this.galleryService.deleteSlideshowFile(filename);
    }
    getGalleryFolders() { return this.galleryService.scanGalleryFolders(); }
    createGalleryFolder(name) {
        return this.galleryService.createFolder(name);
    }
    renameGalleryFolder(oldName, newName) {
        return this.galleryService.renameFolder(oldName, newName);
    }
    deleteGalleryFolder(folder) {
        return this.galleryService.deleteFolder(folder);
    }
    getGalleryFiles(folder) {
        return this.galleryService.scanFiles(folder);
    }
    uploadGalleryFiles(folder, files) {
        return this.galleryService.uploadFiles(folder, files);
    }
    renameGalleryFile(data) {
        return this.galleryService.renameFile(data.folder, data.oldName, data.newName);
    }
    deleteGalleryFile(folder, filename) {
        return this.galleryService.deleteFile(folder, filename);
    }
};
exports.GalleryController = GalleryController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('items'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('isSlideshow')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, String, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "getItems", null);
__decorate([
    (0, common_1.Post)('admin/categories'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "upsertCategory", null);
__decorate([
    (0, common_1.Delete)('admin/categories/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)('admin/items'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN, client_1.Role.EDITOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "upsertItem", null);
__decorate([
    (0, common_1.Delete)('admin/items/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.Patch)('admin/items/:id/slideshow'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN, client_1.Role.EDITOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isSlideshow')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "toggleSlideshow", null);
__decorate([
    (0, common_1.Get)('admin/slideshow-files'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "getSlideshowFiles", null);
__decorate([
    (0, common_1.Post)('admin/slideshow-files/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 20)),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "uploadSlideshowFiles", null);
__decorate([
    (0, common_1.Patch)('admin/slideshow-files/rename'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "renameSlideshowFile", null);
__decorate([
    (0, common_1.Delete)('admin/slideshow-files/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "deleteSlideshowFile", null);
__decorate([
    (0, common_1.Get)('admin/folders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "getGalleryFolders", null);
__decorate([
    (0, common_1.Post)('admin/folders'),
    __param(0, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "createGalleryFolder", null);
__decorate([
    (0, common_1.Patch)('admin/folders/rename'),
    __param(0, (0, common_1.Body)('oldName')),
    __param(1, (0, common_1.Body)('newName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "renameGalleryFolder", null);
__decorate([
    (0, common_1.Delete)('admin/folders'),
    __param(0, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "deleteGalleryFolder", null);
__decorate([
    (0, common_1.Get)('admin/files'),
    __param(0, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "getGalleryFiles", null);
__decorate([
    (0, common_1.Post)('admin/files/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 20)),
    __param(0, (0, common_1.Query)('folder')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "uploadGalleryFiles", null);
__decorate([
    (0, common_1.Patch)('admin/files/rename'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "renameGalleryFile", null);
__decorate([
    (0, common_1.Delete)('admin/files/:filename'),
    __param(0, (0, common_1.Query)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "deleteGalleryFile", null);
exports.GalleryController = GalleryController = __decorate([
    (0, common_1.Controller)('api/gallery'),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], GalleryController);
//# sourceMappingURL=gallery.controller.js.map