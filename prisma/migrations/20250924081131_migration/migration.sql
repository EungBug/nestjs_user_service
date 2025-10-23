/*
  Warnings:

  - You are about to drop the column `occurredAt` on the `AnnualLeaveHistory` table. All the data in the column will be lost.
  - Added the required column `endDT` to the `AnnualLeaveHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDT` to the `AnnualLeaveHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AnnualLeaveHistory` DROP FOREIGN KEY `AnnualLeaveHistory_userId_fkey`;

-- DropIndex
DROP INDEX `AnnualLeaveHistory_userId_occurredAt_idx` ON `AnnualLeaveHistory`;

-- AlterTable
ALTER TABLE `AnnualLeaveHistory` DROP COLUMN `occurredAt`,
    ADD COLUMN `endDT` DATETIME(3) NOT NULL,
    ADD COLUMN `startDT` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `AnnualLeaveHistory_userId_localDate_idx` ON `AnnualLeaveHistory`(`userId`, `localDate`);

-- AddForeignKey
ALTER TABLE `AttendanceHistory` ADD CONSTRAINT `AttendanceHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
