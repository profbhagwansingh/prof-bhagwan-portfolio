import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { MediaType, GalleryCategory } from '@prisma/client';

@Injectable()
export class GalleryService {
    private readonly logger = new Logger(GalleryService.name);

    constructor(
        private prisma: PrismaService,
        private mediaService: MediaService,
    ) { }

    // ─── HELPER: NORMALIZE FOLDER SLUG ──────────────────────────
    private normalizeSlug(folder: string): string {
        const clean = folder
            .replace(/^img\//, '')
            .replace(/^\/+|\/+$/g, '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '-');
        return clean || 'general';
    }

    private formatFolderName(folder: string): string {
        const clean = folder.replace(/^img\//, '').replace(/^\/+|\/+$/g, '').trim();
        return clean
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    private async findOrCreateCategory(folder: string): Promise<GalleryCategory> {
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

    // ─── ENSURE DEFAULT CATEGORIES FOR ADMIN PANEL ─────────────
    private async ensureDefaultFolders(): Promise<void> {
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

    // ─── CATEGORIES ────────────────────────────────────────────
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

    async upsertCategory(data: any) {
        if (data.id) return this.prisma.galleryCategory.update({ where: { id: data.id }, data });
        return this.prisma.galleryCategory.create({ data });
    }

    async deleteCategory(id: string) {
        return this.prisma.galleryCategory.delete({ where: { id } });
    }

    // ─── ITEMS ─────────────────────────────────────────────────
    async getItems(categorySlug?: string, mediaType?: MediaType, isSlideshow?: boolean, page = 1, limit = 20) {
        const where: any = { isActive: true, isPublic: true };
        if (categorySlug) {
            const cat = await this.prisma.galleryCategory.findFirst({
                where: {
                    OR: [
                        { slug: categorySlug },
                        { name: { equals: categorySlug, mode: 'insensitive' } },
                    ],
                },
            });
            if (cat) where.categoryId = cat.id;
        }
        if (mediaType) where.mediaType = mediaType;
        if (isSlideshow !== undefined) where.isSlideshow = isSlideshow;

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

    async upsertItem(data: any) {
        if (data.id) return this.prisma.galleryItem.update({ where: { id: data.id }, data });
        return this.prisma.galleryItem.create({ data });
    }

    async deleteItem(id: string) {
        const item = await this.prisma.galleryItem.findUnique({ where: { id } });
        if (item?.publicId) {
            await this.mediaService.deleteFile(item.publicId);
        }
        return this.prisma.galleryItem.delete({ where: { id } });
    }

    async toggleSlideshow(id: string, isSlideshow: boolean) {
        return this.prisma.galleryItem.update({
            where: { id },
            data: { isSlideshow },
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  FILE MANAGEMENT (Database-backed & Cloudinary-powered)
    // ═══════════════════════════════════════════════════════════

    async scanFiles(folder: string): Promise<string[]> {
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

        if (!category) return [];

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

    async uploadFiles(folder: string, files: any[]): Promise<{ uploaded: string[] }> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        const category = await this.findOrCreateCategory(folder);
        const uploaded: string[] = [];

        const lastItem = await this.prisma.galleryItem.findFirst({
            where: { categoryId: category.id },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true },
        });
        let nextSortOrder = (lastItem?.sortOrder ?? 0) + 1;

        for (const file of files) {
            if (!file?.buffer) {
                throw new BadRequestException(`File ${file?.originalname || 'unknown'} has an empty buffer`);
            }
            if (file.size > 10 * 1024 * 1024) {
                throw new BadRequestException(`File ${file.originalname} exceeds the 10MB limit`);
            }
            if (!file.mimetype || !file.mimetype.startsWith('image/')) {
                throw new BadRequestException(`File ${file.originalname} has invalid type: ${file.mimetype}. Only image files are allowed.`);
            }

            // Upload to Cloudinary under profbhagwan/gallery
            const result = await this.mediaService.saveFile(file, 'profbhagwan/gallery');
            const caption = (file.originalname || 'Archival Image')
                .replace(/\.[^/.]+$/, '')
                .replace(/[-_]/g, ' ');

            const item = await this.prisma.galleryItem.create({
                data: {
                    categoryId: category.id,
                    mediaType: MediaType.PHOTO,
                    mediaUrl: result.url,
                    publicId: result.filename,
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

    async renameFile(folder: string, oldName: string, newName: string): Promise<{ success: boolean; newUrl: string }> {
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

        if (!item) throw new NotFoundException(`File not found: ${oldName}`);

        const cleanCaption = newName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        await this.prisma.galleryItem.update({
            where: { id: item.id },
            data: { caption: cleanCaption, altText: cleanCaption },
        });

        return { success: true, newUrl: item.mediaUrl };
    }

    async deleteFile(folder: string, filename: string): Promise<{ success: boolean }> {
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

    // ─── FOLDER MANAGEMENT ─────────────────────────────────────
    async createFolder(folderName: string): Promise<{ success: boolean }> {
        const cleanName = folderName.trim();
        const slug = this.normalizeSlug(cleanName);
        const existing = await this.prisma.galleryCategory.findFirst({
            where: { OR: [{ slug }, { name: cleanName }] },
        });
        if (existing) {
            throw new BadRequestException(`Folder already exists: ${cleanName}`);
        }
        await this.prisma.galleryCategory.create({
            data: { name: cleanName, slug, sortOrder: 0 },
        });
        this.logger.log(`Created folder: ${cleanName} (${slug})`);
        return { success: true };
    }

    async renameFolder(oldName: string, newName: string): Promise<{ success: boolean }> {
        const oldSlug = this.normalizeSlug(oldName);
        const category = await this.prisma.galleryCategory.findFirst({
            where: { OR: [{ slug: oldSlug }, { name: oldName }] },
        });
        if (!category) {
            throw new NotFoundException(`Folder not found: ${oldName}`);
        }
        const newSlug = this.normalizeSlug(newName);
        await this.prisma.galleryCategory.update({
            where: { id: category.id },
            data: { name: newName.replace(/^img\//, ''), slug: newSlug },
        });
        this.logger.log(`Renamed folder: ${oldName} -> ${newName}`);
        return { success: true };
    }

    async deleteFolder(folderName: string): Promise<{ success: boolean }> {
        const slug = this.normalizeSlug(folderName);
        const category = await this.prisma.galleryCategory.findFirst({
            where: { OR: [{ slug }, { name: folderName }] },
            include: { items: true },
        });
        if (!category) {
            throw new NotFoundException(`Folder not found: ${folderName}`);
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

    // ─── GALLERY: scan all media folders (PUBLIC) ────────────────
    async getPublicGalleryFolders(): Promise<{ folder: string; label: string; count: number; sortOrder: number }[]> {
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

    // ─── GALLERY: scan all media folders (ADMIN) ─────────────────
    async scanGalleryFolders(includeEmpty = true): Promise<{ folder: string; label: string; count: number; sortOrder: number }[]> {
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

    // ─── FOLDER SORT ORDER (persisted via SiteSetting) ───────────
    private async getFolderOrderMap(): Promise<Record<string, number>> {
        try {
            const setting = await this.prisma.siteSetting.findUnique({ where: { key: 'gallery_folder_order' } });
            if (setting?.value) return JSON.parse(setting.value);
        } catch { }
        return {};
    }

    async setFolderOrder(orderMap: Record<string, number>): Promise<{ success: boolean }> {
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

    // ─── SLIDESHOW ─────────────────────────────────────────────
    async getSlideshowOrder(): Promise<string[]> {
        try {
            const setting = await this.prisma.siteSetting.findUnique({ where: { key: 'slideshow_order' } });
            if (setting?.value) return JSON.parse(setting.value);
        } catch { }
        return [];
    }

    async setSlideshowOrder(order: string[]): Promise<{ success: boolean }> {
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

    async scanSlideshowFiles(): Promise<string[]> {
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
                if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
        }
        return urls;
    }

    async uploadSlideshowFiles(files: any[]): Promise<{ uploaded: string[] }> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        const category = await this.findOrCreateCategory('slideshow');
        const uploaded: string[] = [];

        const lastItem = await this.prisma.galleryItem.findFirst({
            where: { isSlideshow: true },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true },
        });
        let nextSortOrder = (lastItem?.sortOrder ?? 0) + 1;

        for (const file of files) {
            if (!file?.buffer) {
                throw new BadRequestException(`File ${file?.originalname || 'unknown'} has an empty buffer`);
            }
            if (file.size > 10 * 1024 * 1024) {
                throw new BadRequestException(`File ${file.originalname} exceeds the 10MB limit`);
            }
            if (!file.mimetype || !file.mimetype.startsWith('image/')) {
                throw new BadRequestException(`File ${file.originalname} has invalid type: ${file.mimetype}. Only image files are allowed.`);
            }

            const result = await this.mediaService.saveFile(file, 'profbhagwan/gallery');
            const caption = (file.originalname || 'Slideshow Image')
                .replace(/\.[^/.]+$/, '')
                .replace(/[-_]/g, ' ');

            const item = await this.prisma.galleryItem.create({
                data: {
                    categoryId: category.id,
                    mediaType: MediaType.PHOTO,
                    mediaUrl: result.url,
                    publicId: result.filename,
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

    async renameSlideshowFile(oldName: string, newName: string) {
        return this.renameFile('slideshow', oldName, newName);
    }

    async deleteSlideshowFile(filename: string) {
        return this.deleteFile('slideshow', filename);
    }
}
