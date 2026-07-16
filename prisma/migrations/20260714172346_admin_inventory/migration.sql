-- AlterTable
ALTER TABLE "build_options" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "inventory_items" ADD COLUMN     "build_description" TEXT,
ADD COLUMN     "cockpit" TEXT,
ADD COLUMN     "display_color" TEXT,
ADD COLUMN     "display_model" TEXT,
ADD COLUMN     "display_size" TEXT,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "item_type" TEXT NOT NULL DEFAULT 'frame',
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 100;
