/*
  Warnings:

  - The values [HALF_FM] on the enum `AnnualLeaveHistory_annualLeaveType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `hiredAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AnnualLeaveHistory` MODIFY `annualLeaveType` ENUM('ALL_DAY', 'HALF_AM', 'HALF_PM') NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `hiredAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `AnnualLeaveSummary` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `year` INTEGER NOT NULL,
    `entitlementDays` DECIMAL(5, 2) NOT NULL,
    `carriedOverDays` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `extraGrantedDays` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `usedDays` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `lastAccruedMonth` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AnnualLeaveSummary_userId_year_idx`(`userId`, `year`),
    UNIQUE INDEX `AnnualLeaveSummary_userId_year_key`(`userId`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AnnualLeaveHistory` ADD CONSTRAINT `AnnualLeaveHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualLeaveSummary` ADD CONSTRAINT `AnnualLeaveSummary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
