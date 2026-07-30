import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GalleryService {
    private readonly logger = new Logger(GalleryService.name);
    private readonly mediaRoot: string;

    constructor(private prisma: PrismaService) {
        this.mediaRoot = path.join(process.cwd(), '..', 'frontend', 'public', 'media');
    }

    // ─── CATEGORIES ────────────────────────────────────────
    async getCategories() {
        return this.prisma.galleryCategory.findMany({
            include: { items: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
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

    // ─── ITEMS ─────────────────────────────────────────────
    async getItems(categorySlug?: string, mediaType?: MediaType, isSlideshow?: boolean, page = 1, limit = 20) {
        const where: any = { isActive: true };
        if (categorySlug) {
            const cat = await this.prisma.galleryCategory.findUnique({ where: { slug: categorySlug } });
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
        return this.prisma.galleryItem.delete({ where: { id } });
    }

    async toggleSlideshow(id: string, isSlideshow: boolean) {
        return this.prisma.galleryItem.update({
            where: { id },
            data: { isSlideshow },
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  GENERIC FILE MANAGEMENT (works for any subfolder)
    // ═══════════════════════════════════════════════════════════
    private resolveDir(folder: string): string {
        // Prevent path traversal securely
        const targetPath = path.resolve(this.mediaRoot, folder.replace(/^\/+/, ''));
        if (!targetPath.startsWith(path.resolve(this.mediaRoot))) {
            throw new Error(`Invalid folder path: traversal attempt detected.`);
        }
        return targetPath;
    }

    async scanFiles(folder: string): Promise<string[]> {
        const dir = this.resolveDir(folder);
        this.logger.log(`Scanning: ${dir}`);
        try {
            if (!fs.existsSync(dir)) {
                this.logger.warn(`Directory not found: ${dir}`);
                return [];
            }
            const files = fs.readdirSync(dir)
                .filter((f: string) => !f.startsWith('.'))
                .filter((f: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
                .sort()
                .map((f: string) => `/media/${safe(folder)}/${f}`);
            this.logger.log(`Found ${files.length} files in ${folder}`);
            return files;
        } catch (err) {
            this.logger.error(`Failed to scan ${folder}: ${err}`);
            return [];
        }
    }

    async uploadFiles(folder: string, files: any[]): Promise<{ uploaded: string[] }> {
        const dir = this.resolveDir(folder);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const uploaded: string[] = [];
        for (const file of files) {
            const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
            fs.writeFileSync(path.join(dir, safeName), file.buffer);
            uploaded.push(`/media/${safe(folder)}/${safeName}`);
            this.logger.log(`Uploaded to ${folder}: ${safeName}`);
        }
        return { uploaded };
    }

    async renameFile(folder: string, oldName: string, newName: string): Promise<{ success: boolean; newUrl: string }> {
        const dir = this.resolveDir(folder);
        const safeOld = path.basename(oldName);
        const ext = path.extname(safeOld);
        let safeNew = newName.replace(/[^a-zA-Z0-9._-]/g, '_');
        if (!safeNew.endsWith(ext)) safeNew += ext;

        const oldPath = path.join(dir, safeOld);
        const newPath = path.join(dir, safeNew);

        if (!fs.existsSync(oldPath)) throw new Error(`File not found: ${safeOld}`);
        if (fs.existsSync(newPath) && safeOld !== safeNew) throw new Error(`Already exists: ${safeNew}`);

        fs.renameSync(oldPath, newPath);
        this.logger.log(`Renamed in ${folder}: ${safeOld} -> ${safeNew}`);
        return { success: true, newUrl: `/media/${safe(folder)}/${safeNew}` };
    }

    async deleteFile(folder: string, filename: string): Promise<{ success: boolean }> {
        const dir = this.resolveDir(folder);
        const safeName = path.basename(filename);
        const filePath = path.join(dir, safeName);

        if (!fs.existsSync(filePath)) throw new Error(`File not found: ${safeName}`);
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted from ${folder}: ${safeName}`);
        return { success: true };
    }

    // ─── FOLDER MANAGEMENT ─────────────────────────────────────
    async createFolder(folderName: string): Promise<{ success: boolean }> {
        const dir = this.resolveDir(folderName);
        if (fs.existsSync(dir)) throw new Error(`Folder already exists: ${folderName}`);
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created folder: ${folderName}`);
        return { success: true };
    }

    async renameFolder(oldName: string, newName: string): Promise<{ success: boolean }> {
        // Only allow renaming top-level folders or img/ subfolders
        const oldDir = this.resolveDir(oldName);
        const newDir = this.resolveDir(newName);
        if (!fs.existsSync(oldDir)) throw new Error(`Folder not found: ${oldName}`);
        if (fs.existsSync(newDir)) throw new Error(`Folder already exists: ${newName}`);
        fs.renameSync(oldDir, newDir);
        this.logger.log(`Renamed folder: ${oldName} -> ${newName}`);
        return { success: true };
    }

    async deleteFolder(folderName: string): Promise<{ success: boolean }> {
        const dir = this.resolveDir(folderName);
        if (!fs.existsSync(dir)) throw new Error(`Folder not found: ${folderName}`);
        // For safety, only allow deleting empty folders, or we can use rmSync with recursive.
        // The user wants to remove folders. Let's use recursive true.
        fs.rmSync(dir, { recursive: true, force: true });
        this.logger.log(`Deleted folder: ${folderName}`);
        return { success: true };
    }

    // ─── GALLERY: scan all media folders (PUBLIC) ────────────────
    async getPublicGalleryFolders(): Promise<{ folder: string; label: string; count: number; sortOrder: number }[]> {
        return this.scanGalleryFolders(false);
    }

    // ─── GALLERY: scan all media folders (ADMIN) ─────────────────
    async scanGalleryFolders(includeEmpty = true): Promise<{ folder: string; label: string; count: number; sortOrder: number }[]> {
        const imgDir = path.join(this.mediaRoot, 'img');
        const folders: { folder: string; label: string; count: number; sortOrder: number }[] = [];

        // Load stored sort orders from SiteSetting
        const orderMap = await this.getFolderOrderMap();

        // Scan img/ subfolders (excluding slideshow — that has its own tab)
        if (fs.existsSync(imgDir)) {
            for (const name of fs.readdirSync(imgDir)) {
                if (name === 'slideshow' || name.startsWith('.')) continue;
                const full = path.join(imgDir, name);
                try {
                    if (!fs.statSync(full).isDirectory()) continue;
                } catch { continue; }
                const count = fs.readdirSync(full).filter(f => !f.startsWith('.') && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f)).length;
                if (includeEmpty || count > 0) {
                    const folderPath = `img/${name}`;
                    folders.push({ folder: folderPath, label: name.replace(/[-_]/g, ' '), count, sortOrder: orderMap[folderPath] ?? 999 });
                }
            }
        }

        // Scan other media root folders (paperCuttings, Courses Taught, etc.)
        for (const name of fs.readdirSync(this.mediaRoot)) {
            if (['img', 'video'].includes(name) || name.startsWith('.')) continue;
            const full = path.join(this.mediaRoot, name);
            try {
                if (!fs.statSync(full).isDirectory()) continue;
            } catch { continue; }
            const count = fs.readdirSync(full).filter(f => !f.startsWith('.') && /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(f)).length;
            if (includeEmpty || count > 0) {
                folders.push({ folder: name, label: name.replace(/[-_]/g, ' '), count, sortOrder: orderMap[name] ?? 999 });
            }
        }

        return folders.sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
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
        await this.prisma.siteSetting.upsert({
            where: { key: 'gallery_folder_order' },
            update: { value: JSON.stringify(orderMap) },
            create: { key: 'gallery_folder_order', value: JSON.stringify(orderMap) },
        });
        this.logger.log(`Folder order saved: ${JSON.stringify(orderMap)}`);
        return { success: true };
    }

    // ─── Convenience wrappers for slideshow ──────────────────
    async getSlideshowOrder(): Promise<string[]> {
        try {
            const setting = await this.prisma.siteSetting.findUnique({ where: { key: 'slideshow_order' } });
            if (setting?.value) return JSON.parse(setting.value);
        } catch {}
        return [];
    }

    async setSlideshowOrder(order: string[]): Promise<{ success: boolean }> {
        await this.prisma.siteSetting.upsert({
            where: { key: 'slideshow_order' },
            update: { value: JSON.stringify(order) },
            create: { key: 'slideshow_order', value: JSON.stringify(order) },
        });
        return { success: true };
    }

    async scanSlideshowFiles() { 
        const files = await this.scanFiles('img/slideshow'); 
        const order = await this.getSlideshowOrder();
        
        if (order.length > 0) {
            files.sort((a, b) => {
                const indexA = order.indexOf(a);
                const indexB = order.indexOf(b);
                if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
        }
        return files;
    }
    async uploadSlideshowFiles(files: any[]) { return this.uploadFiles('img/slideshow', files); }
    async renameSlideshowFile(oldName: string, newName: string) { return this.renameFile('img/slideshow', oldName, newName); }
    async deleteSlideshowFile(filename: string) { return this.deleteFile('img/slideshow', filename); }
}

// helper to normalize folder path for URLs
function safe(folder: string): string {
    return folder.replace(/\\/g, '/');
}
