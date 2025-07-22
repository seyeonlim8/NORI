/*
  Warnings:

  - A unique constraint covering the columns `[userId,type,level,wordId]` on the table `StudyProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `level` to the `StudyProgress` table without a default value. This is not possible if the table is not empty.
  - Made the column `currentIndex` on table `StudyProgress` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `StudyProgress` DROP FOREIGN KEY `StudyProgress_userId_fkey`;

-- DropForeignKey
ALTER TABLE `StudyProgress` DROP FOREIGN KEY `StudyProgress_wordId_fkey`;

-- DropIndex
DROP INDEX `StudyProgress_userId_wordId_type_key` ON `StudyProgress`;

-- DropIndex
DROP INDEX `StudyProgress_wordId_fkey` ON `StudyProgress`;

-- AlterTable
ALTER TABLE `StudyProgress` ADD COLUMN `level` VARCHAR(191) NOT NULL,
    ALTER COLUMN `completed` DROP DEFAULT,
    MODIFY `currentIndex` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `StudyProgress_userId_type_level_wordId_key` ON `StudyProgress`(`userId`, `type`, `level`, `wordId`);

-- AddForeignKey
ALTER TABLE `StudyProgress` ADD CONSTRAINT `fk_studyprogress_user` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyProgress` ADD CONSTRAINT `fk_studyprogress_word` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
