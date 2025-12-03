/*
  Warnings:

  - You are about to drop the column `space_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `image_urls` on the `spaces` table. All the data in the column will be lost.
  - You are about to drop the column `image_urls` on the `workspaces` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_space_id_fkey`;

-- DropIndex
DROP INDEX `bookings_space_id_fkey` ON `bookings`;

-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `space_id`,
    DROP COLUMN `total_amount`;

-- AlterTable
ALTER TABLE `spaces` DROP COLUMN `image_urls`,
    ADD COLUMN `floor_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `workspaces` DROP COLUMN `image_urls`;

-- CreateTable
CREATE TABLE `workspace_images` (
    `id` VARCHAR(191) NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `floors` (
    `floor_id` VARCHAR(191) NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `image_url` VARCHAR(191) NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`floor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `space_images` (
    `id` VARCHAR(191) NOT NULL,
    `spaceId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_spaces` (
    `booking_space_id` VARCHAR(191) NOT NULL,
    `booking_id` VARCHAR(191) NOT NULL,
    `space_id` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL,

    PRIMARY KEY (`booking_space_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `workspace_images` ADD CONSTRAINT `workspace_images_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`workspace_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `floors` ADD CONSTRAINT `floors_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`workspace_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spaces` ADD CONSTRAINT `spaces_floor_id_fkey` FOREIGN KEY (`floor_id`) REFERENCES `floors`(`floor_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `space_images` ADD CONSTRAINT `space_images_spaceId_fkey` FOREIGN KEY (`spaceId`) REFERENCES `spaces`(`space_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_spaces` ADD CONSTRAINT `booking_spaces_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_spaces` ADD CONSTRAINT `booking_spaces_space_id_fkey` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`space_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
