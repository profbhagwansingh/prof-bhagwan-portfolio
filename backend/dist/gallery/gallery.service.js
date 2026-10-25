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
var GalleryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const media_service_1 = require("../media/media.service");
const client_1 = require("@prisma/client");
let GalleryService = GalleryService_1 = class GalleryService {
    constructor(prisma, mediaService) {
        this.prisma = prisma;
        this.mediaService = mediaService;
        this.logger = new common_1.Logger(GalleryService_1.name);
    }
    normalizeSlug(folder) {
        const clean = folder
            .replace(/^img\//, '')
            .replace(/^\/+|\/+$/g, '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '-');
        return clean || 'general';
    }
    formatFolderName(folder) {
        const clean = folder.replace(/^img\//, '').replace(/^\/+|\/+$/g, '').trim();
        return clean
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }
    async findOrCreateCategory(folder) {
        const slug = this.normalizeSlug(folder);
        const displayName = this.formatFolderName(folder);
        let category = await this.prisma.galleryCategory.findFirst({
            where: {
                OR: [
                    { slug },
                    { name: { equals: displayName, mode: 'insensitive' } },
                    { name: { equals: folder, mode: 'insensitive' } },
                ],
            },
        });
        if (!category) {
            category = await this.prisma.galleryCategory.create({
                data: {
                    name: displayName,
                    slug,
                    sortOrder: 0,
                },
            });
            this.logger.log(`Created new GalleryCategory: ${displayName} (${slug})`);
        }
        return category;
    }
    async ensureDefaultFolders() {
        const defaults = ['Achievements', 'Books', 'Recent', 'Research Scholars', 'Paper Cuttings'];
        for (const name of defaults) {
            const slug = this.normalizeSlug(name);
            const exists = await this.prisma.galleryCategory.findFirst({
                where: { OR: [{ slug }, { name }] },
            });
            if (!exists) {
                await this.prisma.galleryCategory.create({
                    data: { name, slug, sortOrder: 0 },
                });
            }
        }
    }
    async getCategories() {
        return this.prisma.galleryCategory.findMany({
            include: {
                items: {
                    where: { isActive: true, isPublic: true },
                    orderBy: { sortOrder: 'asc' },
                },
            },
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
        const where = { isActive: true, isPublic: true };
        if (categorySlug) {
            const cat = await this.prisma.galleryCategory.findFirst({
                where: {
                    OR: [
                        { slug: categorySlug },
                        { name: { equals: categorySlug, mode: 'insensitive' } },
                    ],
                },
            });
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
        const item = await this.prisma.galleryItem.findUnique({ where: { id } });
        if (item?.publicId) {
            await this.mediaService.deleteFile(item.publicId);
        }
        return this.prisma.galleryItem.delete({ where: { id } });
    }
    async toggleSlideshow(id, isSlideshow) {
        return this.prisma.galleryItem.update({
            where: { id },
            data: { isSlideshow },
        });
    }
    async scanFiles(folder) {
        const cleanSlug = this.normalizeSlug(folder);
        if (cleanSlug === 'slideshow') {
            return this.scanSlideshowFiles();
        }
        const category = await this.prisma.galleryCategory.findFirst({
            where: {
                OR: [
                    { slug: cleanSlug },
                    { name: { equals: folder.replace(/^img\//, ''), mode: 'insensitive' } },
                ],
            },
        });
        if (!category)
            return [];
        const items = await this.prisma.galleryItem.findMany({
            where: {
                categoryId: category.id,
                isActive: true,
                isPublic: true,
            },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
        return items.map((item) => item.mediaUrl);
    }
    async uploadFiles(folder, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const category = await this.findOrCreateCategory(folder);
        const uploaded = [];
        const lastItem = await this.prisma.galleryItem.findFirst({
            where: { categoryId: category.id },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true },
        });
        let nextSortOrder = (lastItem?.sortOrder ?? 0) + 1;
        for (const file of files) {
            if (!file?.buffer) {
                throw new common_1.BadRequestException(`File ${file?.originalname || 'unknown'} has an empty buffer`);
            }
            if (file.size > 10 * 1024 * 1024) {
                throw new common_1.BadRequestException(`File ${file.originalname} exceeds the 10MB limit`);
            }
            if (!file.mimetype || !file.mimetype.match(/^image\/(jpeg|jpg|png|webp|gif)$/i)) {
                throw new common_1.BadRequestException(`File ${file.originalname} has invalid type: ${file.mimetype}. Only raster photos (JPEG, PNG, WebP, GIF) are allowed.`);
            }
            const result = await this.mediaService.saveFile(file, 'profbhagwan/gallery');
            const secureUrl = (result.secure_url || result.url).replace(/^http:\/\//i, 'https://');
            const caption = (file.originalname || 'Archival Image')
                .replace(/\.[^/.]+$/, '')
                .replace(/[-_]/g, ' ');
            const item = await this.prisma.galleryItem.create({
                data: {
                    categoryId: category.id,
                    mediaType: client_1.MediaType.PHOTO,
                    mediaUrl: secureUrl,
                    publicId: result.public_id || result.filename,
                    caption,
                    altText: caption,
                    sortOrder: nextSortOrder++,
                    isActive: true,
                    isPublic: true,
                    isSlideshow: false,
                },
            });
            uploaded.push(item.mediaUrl);
            this.logger.log(`Uploaded to Cloudinary (profbhagwan/gallery): ${item.id} -> ${item.mediaUrl}`);
        }
        return { uploaded };
    }
    async renameFile(folder, oldName, newName) {
        const decodedOld = decodeURIComponent(oldName);
        const item = await this.prisma.galleryItem.findFirst({
            where: {
                OR: [
                    { mediaUrl: { contains: decodedOld } },
                    { publicId: decodedOld.replace(/\.[^/.]+$/, '') },
                    { id: decodedOld },
                ],
            },
        });
        if (!item)
            throw new common_1.NotFoundException(`File not found: ${oldName}`);
        const cleanCaption = newName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        await this.prisma.galleryItem.update({
            where: { id: item.id },
            data: { caption: cleanCaption, altText: cleanCaption },
        });
        return { success: true, newUrl: item.mediaUrl };
    }
    async deleteFile(folder, filename) {
        const decoded = decodeURIComponent(filename);
        const item = await this.prisma.galleryItem.findFirst({
            where: {
                OR: [
                    { mediaUrl: { contains: decoded } },
                    { publicId: decoded.replace(/\.[^/.]+$/, '') },
                    { id: decoded },
                ],
            },
        });
        if (!item) {
            this.logger.warn(`File to delete not found in gallery_items: ${filename}`);
            return { success: true };
        }
        if (item.publicId) {
            await this.mediaService.deleteFile(item.publicId);
        }
        await this.prisma.galleryItem.delete({ where: { id: item.id } });
        this.logger.log(`Deleted gallery item: ${item.id} (publicId: ${item.publicId})`);
        return { success: true };
    }
    async createFolder(folderName) {
        const cleanName = folderName.trim();
        const slug = this.normalizeSlug(cleanName);
        const existing = await this.prisma.galleryCategory.findFirst({
            where: { OR: [{ slug }, { name: cleanName }] },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Folder already exists: ${cleanName}`);
        }
        await this.prisma.galleryCategory.create({
            data: { name: cleanName, slug, sortOrder: 0 },
        });
        this.logger.log(`Created folder: ${cleanName} (${slug})`);
        return { success: true };
    }
    async renameFolder(oldName, newName) {
        const oldSlug = this.normalizeSlug(oldName);
        const category = await this.prisma.galleryCategory.findFirst({
            where: { OR: [{ slug: oldSlug }, { name: oldName }] },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Folder not found: ${oldName}`);
        }
        const newSlug = this.normalizeSlug(newName);
        await this.prisma.galleryCategory.update({
            where: { id: category.id },
            data: { name: newName.replace(/^img\//, ''), slug: newSlug },
        });
        this.logger.log(`Renamed folder: ${oldName} -> ${newName}`);
        return { success: true };
    }
    async deleteFolder(folderName) {
        const slug = this.normalizeSlug(folderName);
        const category = await this.prisma.galleryCategory.findFirst({
            where: { OR: [{ slug }, { name: folderName }] },
            include: { items: true },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Folder not found: ${folderName}`);
        }
        for (const item of category.items) {
            if (item.publicId) {
                await this.mediaService.deleteFile(item.publicId);
            }
        }
        await this.prisma.galleryCategory.delete({ where: { id: category.id } });
        this.logger.log(`Deleted folder and items: ${folderName}`);
        return { success: true };
    }
    async getPublicGalleryFolders() {
        const categories = await this.prisma.galleryCategory.findMany({
            where: {
                AND: [
                    { slug: { not: 'slideshow' } },
                    { slug: { not: { contains: 'backup' } } },
                    { slug: { not: { contains: 'original' } } },
                    { slug: { not: { startsWith: '_' } } },
                ],
            },
            include: {
                items: {
                    where: { isActive: true, isPublic: true },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        const orderMap = await this.getFolderOrderMap();
        return categories
            .filter((c) => c.items.length > 0)
            .map((c) => ({
            folder: c.slug,
            label: c.name,
            count: c.items.length,
            sortOrder: orderMap[c.slug] ?? orderMap[`img/${c.slug}`] ?? c.sortOrder ?? 0,
        }))
            .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
    }
    async scanGalleryFolders(includeEmpty = true) {
        await this.ensureDefaultFolders();
        const categories = await this.prisma.galleryCategory.findMany({
            where: {
                slug: { not: 'slideshow' },
            },
            include: {
                items: {
                    where: { isActive: true },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        const orderMap = await this.getFolderOrderMap();
        return categories
            .filter((c) => includeEmpty || c.items.length > 0)
            .map((c) => ({
            folder: c.slug,
            label: c.name,
            count: c.items.length,
            sortOrder: orderMap[c.slug] ?? orderMap[`img/${c.slug}`] ?? c.sortOrder ?? 0,
        }))
            .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
    }
    async getFolderOrderMap() {
        try {
            const setting = await this.prisma.siteSetting.findUnique({ where: { key: 'gallery_folder_order' } });
            if (setting?.value)
                return JSON.parse(setting.value);
        }
        catch { }
        return {};
    }
    async setFolderOrder(orderMap) {
        for (const [folderKey, sortOrder] of Object.entries(orderMap)) {
            const cleanSlug = this.normalizeSlug(folderKey);
            await this.prisma.galleryCategory.updateMany({
                where: {
                    OR: [
                        { slug: cleanSlug },
                        { slug: folderKey },
                    ],
                },
                data: { sortOrder },
            });
        }
        await this.prisma.siteSetting.upsert({
            where: { key: 'gallery_folder_order' },
            update: { value: JSON.stringify(orderMap) },
            create: { key: 'gallery_folder_order', value: JSON.stringify(orderMap) },
        });
        this.logger.log(`Folder order saved: ${JSON.stringify(orderMap)}`);
        return { success: true };
    }
    async getSlideshowOrder() {
        try {
            const setting = await this.prisma.siteSetting.findUnique({ where: { key: 'slideshow_order' } });
            if (setting?.value)
                return JSON.parse(setting.value);
        }
        catch { }
        return [];
    }
    async setSlideshowOrder(order) {
        for (let i = 0; i < order.length; i++) {
            await this.prisma.galleryItem.updateMany({
                where: { mediaUrl: order[i] },
                data: { sortOrder: i },
            });
        }
        await this.prisma.siteSetting.upsert({
            where: { key: 'slideshow_order' },
            update: { value: JSON.stringify(order) },
            create: { key: 'slideshow_order', value: JSON.stringify(order) },
        });
        return { success: true };
    }
    async scanSlideshowFiles() {
        const items = await this.prisma.galleryItem.findMany({
            where: { isSlideshow: true, isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
        const urls = items.map((i) => i.mediaUrl);
        const order = await this.getSlideshowOrder();
        if (order.length > 0) {
            urls.sort((a, b) => {
                const indexA = order.indexOf(a);
                const indexB = order.indexOf(b);
                if (indexA === -1 && indexB === -1)
                    return a.localeCompare(b);
                if (indexA === -1)
                    return 1;
                if (indexB === -1)
                    return -1;
                return indexA - indexB;
            });
        }
        return urls;
    }
    async uploadSlideshowFiles(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const category = await this.findOrCreateCategory('slideshow');
        const uploaded = [];
        const lastItem = await this.prisma.galleryItem.findFirst({
            where: { isSlideshow: true },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true },
        });
        let nextSortOrder = (lastItem?.sortOrder ?? 0) + 1;
        for (const file of files) {
            if (!file?.buffer) {
                throw new common_1.BadRequestException(`File ${file?.originalname || 'unknown'} has an empty buffer`);
            }
            if (file.size > 10 * 1024 * 1024) {
                throw new common_1.BadRequestException(`File ${file.originalname} exceeds the 10MB limit`);
            }
            if (!file.mimetype || !file.mimetype.match(/^image\/(jpeg|jpg|png|webp|gif)$/i)) {
                throw new common_1.BadRequestException(`File ${file.originalname} has invalid type: ${file.mimetype}. Only raster photos (JPEG, PNG, WebP, GIF) are allowed.`);
            }
            const result = await this.mediaService.saveFile(file, 'profbhagwan/gallery');
            const secureUrl = (result.secure_url || result.url).replace(/^http:\/\//i, 'https://');
            const caption = (file.originalname || 'Slideshow Image')
                .replace(/\.[^/.]+$/, '')
                .replace(/[-_]/g, ' ');
            const item = await this.prisma.galleryItem.create({
                data: {
                    categoryId: category.id,
                    mediaType: client_1.MediaType.PHOTO,
                    mediaUrl: secureUrl,
                    publicId: result.public_id || result.filename,
                    caption,
                    altText: caption,
                    sortOrder: nextSortOrder++,
                    isActive: true,
                    isPublic: true,
                    isSlideshow: true,
                },
            });
            uploaded.push(item.mediaUrl);
            this.logger.log(`Uploaded slideshow image to Cloudinary: ${item.id} -> ${item.mediaUrl}`);
        }
        const currentOrder = await this.getSlideshowOrder();
        await this.setSlideshowOrder([...currentOrder, ...uploaded]);
        return { uploaded };
    }
    async renameSlideshowFile(oldName, newName) {
        return this.renameFile('slideshow', oldName, newName);
    }
    async deleteSlideshowFile(filename) {
        return this.deleteFile('slideshow', filename);
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = GalleryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        media_service_1.MediaService])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map