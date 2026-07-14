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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let MediaService = class MediaService {
    constructor(config) {
        this.config = config;
        cloudinary_1.v2.config({
            cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.config.get('CLOUDINARY_API_KEY'),
            api_secret: this.config.get('CLOUDINARY_API_SECRET'),
        });
    }
    async saveFile(file) {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload_stream({ folder: 'profbhagwan', resource_type: 'auto' }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result?.secure_url || !result?.public_id) {
                    return reject(new Error('Invalid upload result'));
                }
                resolve({ url: result.secure_url, filename: result.public_id });
            }).end(file.buffer);
        });
    }
    async deleteFile(fileUrl) {
        try {
            await cloudinary_1.v2.uploader.destroy(fileUrl);
        }
        catch (e) {
            console.error('Cloudinary delete error:', e);
        }
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MediaService);
//# sourceMappingURL=media.service.js.map