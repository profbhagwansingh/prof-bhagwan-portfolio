const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const slideshowDir = path.join(__dirname, '../frontend/public/media/img/slideshow');
    const files = fs.readdirSync(slideshowDir).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    
    console.log(`Found ${files.length} slideshow images. Syncing to database...`);
    
    let category = await prisma.galleryCategory.findFirst({ where: { name: 'Slideshow' } });
    if (!category) {
        category = await prisma.galleryCategory.create({
            data: {
                name: 'Slideshow',
                slug: 'slideshow'
            }
        });
    }

    let added = 0;
    for (const file of files) {
        const url = `/media/img/slideshow/${file}`;
        
        // Check if it already exists
        const existing = await prisma.galleryItem.findFirst({
            where: { mediaUrl: url }
        });
        
        if (!existing) {
            await prisma.galleryItem.create({
                data: {
                    categoryId: category.id,
                    mediaUrl: url,
                    mediaType: 'PHOTO',
                    caption: `Slideshow Image ${file}`,
                    isActive: true,
                    isSlideshow: true
                }
            });
            added++;
        }
    }
    
    console.log(`Successfully added ${added} new slideshow images to GalleryItem database.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
