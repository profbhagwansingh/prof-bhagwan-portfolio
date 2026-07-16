const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, 'public', 'media', 'img');
const backupDir = path.join(imgDir, '_originals_backup');

async function processImages() {
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const files = fs.readdirSync(imgDir);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
        
        const filePath = path.join(imgDir, file);
        if (!fs.statSync(filePath).isFile()) continue;

        const backupPath = path.join(backupDir, file);
        
        // Backup first
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(filePath, backupPath);
        }

        try {
            console.log(`Compressing ${file}...`);
            const image = sharp(backupPath);
            const metadata = await image.metadata();

            let sharpInstance = image;
            if (metadata.width > 1920 || metadata.height > 1080) {
                sharpInstance = sharpInstance.resize(1920, 1080, { fit: 'inside', withoutEnlargement: true });
            }

            // Convert to JPEG if PNG
            if (ext === '.png') {
                const newFileName = file.replace(/\.png$/i, '.jpg');
                const newFilePath = path.join(imgDir, newFileName);
                await sharpInstance.jpeg({ quality: 80 }).toFile(newFilePath);
                
                // If the name changed, remove the old png
                if (file !== newFileName) {
                    fs.unlinkSync(filePath);
                }
            } else {
                // It's already JPEG/JPG
                await sharpInstance.jpeg({ quality: 80 }).toFile(filePath);
            }
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }
    console.log('Finished compressing images in ' + imgDir);
}

processImages();
