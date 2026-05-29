-- AlterTable
ALTER TABLE "gallery_items" ADD COLUMN     "isSlideshow" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "publications" ADD COLUMN     "authors" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT;
