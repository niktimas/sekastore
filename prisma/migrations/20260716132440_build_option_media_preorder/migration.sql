-- AlterTable
ALTER TABLE "build_options" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "image_path" TEXT,
ADD COLUMN     "is_preorder" BOOLEAN NOT NULL DEFAULT false;
