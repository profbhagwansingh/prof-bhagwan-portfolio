const fs = require('fs');
const path = require('path');

// 1. Load environment variables
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

// Ensure pgbouncer=true to prevent prepared statement collisions
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('pgbouncer=true')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.includes('?') 
    ? `${process.env.DATABASE_URL}&pgbouncer=true` 
    : `${process.env.DATABASE_URL}?pgbouncer=true`;
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Determine mode: Dry-run by default unless explicitly passed --apply
const isApplyMode = process.argv.includes('--apply');
const isDryRun = !isApplyMode;

const MEDIA_ROOT = path.resolve(__dirname, '..', 'frontend', 'public', 'media');

async function main() {
  console.log('===========================================================');
  console.log(` GALLERY LEGACY MIGRATION: ${isDryRun ? 'DRY-RUN MODE (No changes will be made)' : 'APPLY MODE (Writing to Cloudinary & DB)'}`);
  console.log('===========================================================');
  console.log(`Media source directory: ${MEDIA_ROOT}\n`);

  // Query all legacy rows starting with /media/
  const legacyRows = await prisma.galleryItem.findMany({
    where: {
      mediaUrl: { startsWith: '/media/' }
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Total legacy rows found in database: ${legacyRows.length}\n`);

  const skippedTrashed = [];
  const readyToMigrate = [];
  const missingFiles = [];

  for (const item of legacyRows) {
    const url = item.mediaUrl;
    const rawFileName = url.split('/').pop() || '';
    const decodedFileName = decodeURIComponent(rawFileName);

    // 1. Check for .trashed- files
    if (rawFileName.startsWith('.trashed-') || decodedFileName.startsWith('.trashed-')) {
      skippedTrashed.push({
        id: item.id,
        mediaUrl: url,
        filename: decodedFileName,
        caption: item.caption,
      });
      continue;
    }

    // 2. Check existence on local disk
    const relativePath = url.replace(/^\/media\//, '');
    let fullLocalPath = path.resolve(MEDIA_ROOT, relativePath);
    let found = fs.existsSync(fullLocalPath);

    // If not found directly, also check decoded path
    if (!found) {
      fullLocalPath = path.resolve(MEDIA_ROOT, decodeURIComponent(relativePath));
      found = fs.existsSync(fullLocalPath);
    }

    // If still not found, search in img/slideshow fallback
    if (!found) {
      const fallbackPath = path.resolve(MEDIA_ROOT, 'img', 'slideshow', decodedFileName);
      if (fs.existsSync(fallbackPath)) {
        fullLocalPath = fallbackPath;
        found = true;
      }
    }

    if (found) {
      const stats = fs.statSync(fullLocalPath);
      readyToMigrate.push({
        id: item.id,
        mediaUrl: url,
        localPath: fullLocalPath,
        filename: decodedFileName,
        sizeBytes: stats.size,
        sizeKb: (stats.size / 1024).toFixed(1),
      });
    } else {
      missingFiles.push({
        id: item.id,
        mediaUrl: url,
        filename: decodedFileName,
        expectedPath: fullLocalPath,
      });
    }
  }

  // ─── REPORT OUTPUT ───────────────────────────────────────────
  console.log('───────────────────────────────────────────────────────────');
  console.log(`1. SKIPPED FILES (.trashed-) [${skippedTrashed.length} item(s)]`);
  console.log('───────────────────────────────────────────────────────────');
  if (skippedTrashed.length === 0) {
    console.log('None.');
  } else {
    skippedTrashed.forEach((item, idx) => {
      console.log(` [${idx + 1}] ID: ${item.id}`);
      console.log(`     File: ${item.filename}`);
      console.log(`     URL:  ${item.mediaUrl}`);
    });
  }

  console.log('\n───────────────────────────────────────────────────────────');
  console.log(`2. MISSING FILES ON DISK (Flagged for isActive = false) [${missingFiles.length} item(s)]`);
  console.log('───────────────────────────────────────────────────────────');
  if (missingFiles.length === 0) {
    console.log('None. All files exist on local disk!');
  } else {
    missingFiles.forEach((item, idx) => {
      console.log(` [${idx + 1}] ID: ${item.id}`);
      console.log(`     File:     ${item.filename}`);
      console.log(`     URL:      ${item.mediaUrl}`);
      console.log(`     Expected: ${item.expectedPath}`);
    });
  }

  console.log('\n───────────────────────────────────────────────────────────');
  console.log(`3. READY FOR CLOUDINARY MIGRATION [${readyToMigrate.length} item(s)]`);
  console.log('───────────────────────────────────────────────────────────');
  const totalBytes = readyToMigrate.reduce((acc, curr) => acc + curr.sizeBytes, 0);
  console.log(`Total payload size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log('Sample files ready for upload:');
  readyToMigrate.slice(0, 10).forEach((item, idx) => {
    console.log(` [${idx + 1}] ${item.filename} (${item.sizeKb} KB) -> ID: ${item.id}`);
  });
  if (readyToMigrate.length > 10) {
    console.log(` ... and ${readyToMigrate.length - 10} more files.`);
  }

  console.log('\n===========================================================');
  console.log(' MIGRATION SUMMARY');
  console.log('===========================================================');
  console.log(`Total legacy rows scanned:     ${legacyRows.length}`);
  console.log(`Ready to upload to Cloudinary: ${readyToMigrate.length}`);
  console.log(`Missing on disk (deactivate):  ${missingFiles.length}`);
  console.log(`Skipped (.trashed- files):     ${skippedTrashed.length}`);
  console.log('===========================================================');

  if (isDryRun) {
    console.log('\nℹ️  This was a DRY RUN. No files were uploaded and no database rows were modified.');
    console.log('To apply these changes after approval, run:');
    console.log('  node migrate_legacy_gallery.js --apply\n');
    return;
  }

  // ─── APPLY MODE (Executed only if --apply is passed) ────────
  console.log('\nApplying migration for missing files (setting isActive = false)...');
  for (const item of missingFiles) {
    await prisma.galleryItem.update({
      where: { id: item.id },
      data: { isActive: false }
    });
    console.log(`Deactivated missing row: ${item.id}`);
  }

  // Also deactivate .trashed- items
  for (const item of skippedTrashed) {
    await prisma.galleryItem.update({
      where: { id: item.id },
      data: { isActive: false }
    });
    console.log(`Deactivated .trashed- row: ${item.id}`);
  }

  console.log(`\nUploading ${readyToMigrate.length} files to Cloudinary (profbhagwan/gallery)...`);
  const { MediaService } = require('./dist/media/media.service');
  const { ConfigService } = require('@nestjs/config');
  const mediaService = new MediaService(new ConfigService());

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < readyToMigrate.length; i++) {
    const item = readyToMigrate[i];
    const fileBuffer = fs.readFileSync(item.localPath);
    const ext = path.extname(item.filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif'
    };
    const mimetype = mimeTypes[ext] || 'image/jpeg';

    try {
      const uploadRes = await mediaService.saveFile({
        buffer: fileBuffer,
        originalname: item.filename,
        mimetype,
        size: item.sizeBytes,
      }, 'profbhagwan/gallery');

      const secureUrl = (uploadRes.secure_url || uploadRes.url).replace(/^http:\/\//i, 'https://');

      await prisma.galleryItem.update({
        where: { id: item.id },
        data: {
          mediaUrl: secureUrl,
          publicId: uploadRes.public_id || uploadRes.filename,
          isActive: true,
          isPublic: true,
        }
      });

      successCount++;
      console.log(`[${i + 1}/${readyToMigrate.length}] ✅ Migrated: ${item.filename} -> ${uploadRes.public_id}`);
    } catch (err) {
      failCount++;
      console.error(`[${i + 1}/${readyToMigrate.length}] ❌ Failed to migrate ${item.filename}:`, err.message);
    }
  }

  console.log('\n===========================================================');
  console.log(' REAL MIGRATION COMPLETED');
  console.log('===========================================================');
  console.log(`Successfully migrated: ${successCount}`);
  console.log(`Failed to migrate:     ${failCount}`);
  console.log(`Deactivated (missing): ${missingFiles.length}`);
  console.log(`Deactivated (trashed): ${skippedTrashed.length}`);
  console.log('===========================================================');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
