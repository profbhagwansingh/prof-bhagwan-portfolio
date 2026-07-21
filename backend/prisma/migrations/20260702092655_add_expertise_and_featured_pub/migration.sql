-- AlterTable
ALTER TABLE "publications" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "expertise" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconName" TEXT NOT NULL DEFAULT 'BookOpen',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "expertise_pkey" PRIMARY KEY ("id")
);
