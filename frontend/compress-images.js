const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = path.join(__dirname, 'public', 'media', 'img');
const BACKUP_DIR = path.join(SOURCE_DIR, '_originals_backup');

async function processDirectory(dirPath, backupDirPath) {
  if (!fs.existsSync(backupDirPath)) {
    fs.mkdirSync(backupDirPath, { recursive: true });
  }

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const backupPath = path.join(backupDirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item !== '_originals_backup') {
        await processDirectory(fullPath, backupPath);
      }
    } else if (item.match(/\.(jpg|jpeg|png)$/i)) {
      console.log(`Processing: ${fullPath}`);
      try {
        // Backup the original file
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(fullPath, backupPath);
        }

        // Compress and overwrite
        const image = sharp(backupPath);
        const metadata = await image.metadata();

        const ext = path.extname(item).toLowerCase();
        let compressedBuffer;

        if (ext === '.png') {
          // For PNG, convert to JPEG for massive savings
          compressedBuffer = await image
            .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
            
          // Save as new .jpg and remove old .png
          const newPath = fullPath.replace(/\.png$/i, '.jpg');
          fs.writeFileSync(newPath, compressedBuffer);
          if (newPath !== fullPath) {
             fs.unlinkSync(fullPath);
             console.log(`  -> Converted to ${newPath}`);
          }
        } else {
          // For JPEG, just compress
          compressedBuffer = await image
            .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
          fs.writeFileSync(fullPath, compressedBuffer);
          console.log(`  -> Compressed ${fullPath}`);
        }
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
      }
    }
  }
}

async function main() {
  console.log('Starting image compression...');
  await processDirectory(SOURCE_DIR, BACKUP_DIR);
  console.log('Done!');
}

main();
