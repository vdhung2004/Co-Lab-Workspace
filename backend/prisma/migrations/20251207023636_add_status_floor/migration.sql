/*
  Warnings:

  - You are about to drop the column `status` on the `booking_spaces` table. All the data in the column will be lost.
  - Added the required column `status` to the `floors` table without a default value. This is not possible if the table is not empty.
  - Made the column `floor_id` on table `spaces` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `spaces` DROP FOREIGN KEY `spaces_floor_id_fkey`;

-- DropIndex
DROP INDEX `spaces_floor_id_fkey` ON `spaces`;

-- AlterTable
ALTER TABLE `booking_spaces` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `floors` ADD COLUMN `status` ENUM('active', 'inactive', 'maintenance') NOT NULL;

-- AlterTable
ALTER TABLE `spaces` MODIFY `floor_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `spaces` ADD CONSTRAINT `spaces_floor_id_fkey` FOREIGN KEY (`floor_id`) REFERENCES `floors`(`floor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
