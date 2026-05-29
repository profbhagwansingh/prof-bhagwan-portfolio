"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GalleryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let GalleryService = GalleryService_1 = class GalleryService {
    prisma;
    logger = new common_1.Logger(GalleryService_1.name);
    mediaRoot;
    constructor(prisma) {
        this.prisma = prisma;
        this.mediaRoot = path.join(process.cwd(), '..', 'frontend', 'public', 'media');
    }
    async getCategories() {
        return this.prisma.galleryCategory.findMany({
            include: { items: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async upsertCategory(data) {
        if (data.id)
            return this.prisma.galleryCategory.update({ where: { id: data.id }, data });
        return this.prisma.galleryCategory.create({ data });
    }
    async deleteCategory(id) {
        return this.prisma.galleryCategory.delete({ where: { id } });
    }
    async getItems(categorySlug, mediaType, isSlideshow, page = 1, limit = 20) {
        const where = { isActive: true };
        if (categorySlug) {
            const cat = await this.prisma.galleryCategory.findUnique({ where: { slug: categorySlug } });
            if (cat)
                where.categoryId = cat.id;
        }
        if (mediaType)
            where.mediaType = mediaType;
        if (isSlideshow !== undefined)
            where.isSlideshow = isSlideshow;
        const [items, total] = await Promise.all([
            this.prisma.galleryItem.findMany({
                where,
                include: { category: true },
                orderBy: { sortOrder: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.galleryItem.count({ where }),
        ]);
        return { items, total, page, totalPages: Math.ceil(total / limit) };
    }
    async upsertItem(data) {
        if (data.id)
            return this.prisma.galleryItem.update({ where: { id: data.id }, data });
        return this.prisma.galleryItem.create({ data });
    }
    async deleteItem(id) {
        return this.prisma.galleryItem.delete({ where: { id } });
    }
    async toggleSlideshow(id, isSlideshow) {
        return this.prisma.galleryItem.update({
            where: { id },
            data: { isSlideshow },
        });
    }
    resolveDir(folder) {
        const safe = folder.replace(/\.\./g, '').replace(/^\/+/, '');
        return path.join(this.mediaRoot, safe);
    }
    async scanFiles(folder) {
        const dir = this.resolveDir(folder);
        this.logger.log(`Scanning: ${dir}`);
        try {
            if (!fs.existsSync(dir)) {
                this.logger.warn(`Directory not found: ${dir}`);
                return [];
            }
            const files = fs.readdirSync(dir)
                .filter((f) => !f.startsWith('.'))
                .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
                .sort()
                .map((f) => `/media/${safe(folder)}/${f}`);
            this.logger.log(`Found ${files.length} files in ${folder}`);
            return files;
        }
        catch (err) {
            this.logger.error(`Failed to scan ${folder}: ${err}`);
            return [];
        }
    }
    async uploadFiles(folder, files) {
        const dir = this.resolveDir(folder);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        const uploaded = [];
        for (const file of files) {
            const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
            fs.writeFileSync(path.join(dir, safeName), file.buffer);
            uploaded.push(`/media/${safe(folder)}/${safeName}`);
            this.logger.log(`Uploaded to ${folder}: ${safeName}`);
        }
        return { uploaded };
    }
    async renameFile(folder, oldName, newName) {
        const dir = this.resolveDir(folder);
        const safeOld = path.basename(oldName);
        const ext = path.extname(safeOld);
        let safeNew = newName.replace(/[^a-zA-Z0-9._-]/g, '_');
        if (!safeNew.endsWith(ext))
            safeNew += ext;
        const oldPath = path.join(dir, safeOld);
        const newPath = path.join(dir, safeNew);
        if (!fs.existsSync(oldPath))
            throw new Error(`File not found: ${safeOld}`);
        if (fs.existsSync(newPath) && safeOld !== safeNew)
            throw new Error(`Already exists: ${safeNew}`);
        fs.renameSync(oldPath, newPath);
        this.logger.log(`Renamed in ${folder}: ${safeOld} -> ${safeNew}`);
        return { success: true, newUrl: `/media/${safe(folder)}/${safeNew}` };
    }
    async deleteFile(folder, filename) {
        const dir = this.resolveDir(folder);
        const safeName = path.basename(filename);
        const filePath = path.join(dir, safeName);
        if (!fs.existsSync(filePath))
            throw new Error(`File not found: ${safeName}`);
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted from ${folder}: ${safeName}`);
        return { success: true };
    }
    async createFolder(folderName) {
        const dir = this.resolveDir(folderName);
        if (fs.existsSync(dir))
            throw new Error(`Folder already exists: ${folderName}`);
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created folder: ${folderName}`);
        return { success: true };
    }
    async renameFolder(oldName, newName) {
        const oldDir = this.resolveDir(oldName);
        const newDir = this.resolveDir(newName);
        if (!fs.existsSync(oldDir))
            throw new Error(`Folder not found: ${oldName}`);
        if (fs.existsSync(newDir))
            throw new Error(`Folder already exists: ${newName}`);
        fs.renameSync(oldDir, newDir);
        this.logger.log(`Renamed folder: ${oldName} -> ${newName}`);
        return { success: true };
    }
    async deleteFolder(folderName) {
        const dir = this.resolveDir(folderName);
        if (!fs.existsSync(dir))
            throw new Error(`Folder not found: ${folderName}`);
        fs.rmSync(dir, { recursive: true, force: true });
        this.logger.log(`Deleted folder: ${folderName}`);
        return { success: true };
    }
    async scanGalleryFolders() {
        const imgDir = path.join(this.mediaRoot, 'img');
        const folders = [];
        if (fs.existsSync(imgDir)) {
            for (const name of fs.readdirSync(imgDir)) {
                if (name === 'slideshow' || name.startsWith('.'))
                    continue;
                const full = path.join(imgDir, name);
                if (!fs.statSync(full).isDirectory())
                    continue;
                const count = fs.readdirSync(full).filter(f => !f.startsWith('.') && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f)).length;
                folders.push({ folder: `img/${name}`, label: name.replace(/[-_]/g, ' '), count });
            }
        }
        for (const name of fs.readdirSync(this.mediaRoot)) {
            if (['img', 'video'].includes(name) || name.startsWith('.'))
                continue;
            const full = path.join(this.mediaRoot, name);
            if (!fs.statSync(full).isDirectory())
                continue;
            const count = fs.readdirSync(full).filter(f => !f.startsWith('.') && /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(f)).length;
            if (count > 0)
                folders.push({ folder: name, label: name.replace(/[-_]/g, ' '), count });
        }
        return folders.sort((a, b) => a.label.localeCompare(b.label));
    }
    async scanSlideshowFiles() { return this.scanFiles('img/slideshow'); }
    async uploadSlideshowFiles(files) { return this.uploadFiles('img/slideshow', files); }
    async renameSlideshowFile(oldName, newName) { return this.renameFile('img/slideshow', oldName, newName); }
    async deleteSlideshowFile(filename) { return this.deleteFile('img/slideshow', filename); }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = GalleryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GalleryService);
function safe(folder) {
    return folder.replace(/\\/g, '/');
}
//# sourceMappingURL=gallery.service.js.map