/*
  Warnings:

  - You are about to drop the `QuizHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `QuizHistory` DROP FOREIGN KEY `QuizHistory_userId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizHistory` DROP FOREIGN KEY `QuizHistory_wordId_fkey`;

-- DropTable
DROP TABLE `QuizHistory`;
