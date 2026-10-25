-- AlterTable
ALTER TABLE "gallery_items" ADD COLUMN "publicId" TEXT;

-- AlterTable
ALTER TABLE "gallery_items" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT true;
