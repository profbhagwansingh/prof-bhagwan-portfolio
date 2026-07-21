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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomepageController = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("./content.service");
let HomepageController = class HomepageController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    async getHomepageData() {
        return this.contentService.getHomepageData();
    }
};
exports.HomepageController = HomepageController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomepageController.prototype, "getHomepageData", null);
exports.HomepageController = HomepageController = __decorate([
    (0, common_1.Controller)('api/homepage-data'),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], HomepageController);
//# sourceMappingURL=homepage.controller.js.map