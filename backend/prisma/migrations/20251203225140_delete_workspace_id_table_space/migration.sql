/*
  Warnings:

  - You are about to drop the column `workspace_id` on the `spaces` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `spaces` DROP FOREIGN KEY `spaces_workspace_id_fkey`;

-- DropIndex
DROP INDEX `spaces_workspace_id_fkey` ON `spaces`;

-- AlterTable
ALTER TABLE `spaces` DROP COLUMN `workspace_id`;
