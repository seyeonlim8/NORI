-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verifyToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Word` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` VARCHAR(191) NOT NULL,
    `kanji` VARCHAR(191) NOT NULL,
    `furigana` VARCHAR(191) NOT NULL,
    `example_sentence` VARCHAR(191) NOT NULL,
    `answer_in_example` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WordMeaning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wordId` INTEGER NOT NULL,
    `language_code` VARCHAR(191) NOT NULL,
    `word_meaning` VARCHAR(191) NOT NULL,
    `example_sentence_meaning` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteWord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `wordId` INTEGER NOT NULL,

    UNIQUE INDEX `FavoriteWord_userId_wordId_key`(`userId`, `wordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudyProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `wordId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `lastSeen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `StudyProgress_userId_wordId_type_key`(`userId`, `wordId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuizHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `wordId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `answeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WordMeaning` ADD CONSTRAINT `WordMeaning_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteWord` ADD CONSTRAINT `FavoriteWord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteWord` ADD CONSTRAINT `FavoriteWord_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyProgress` ADD CONSTRAINT `StudyProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyProgress` ADD CONSTRAINT `StudyProgress_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizHistory` ADD CONSTRAINT `QuizHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizHistory` ADD CONSTRAINT `QuizHistory_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
