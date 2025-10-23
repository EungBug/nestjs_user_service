-- CreateTable
CREATE TABLE `AnnualLeaveHistory` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `occurredAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `annualLeaveType` ENUM('ALL_DAY', 'HALF_AM', 'HALF_FM') NOT NULL,
    `localDate` VARCHAR(191) NOT NULL,

    INDEX `AnnualLeaveHistory_userId_occurredAt_idx`(`userId`, `occurredAt`),
    UNIQUE INDEX `AnnualLeaveHistory_userId_annualLeaveType_localDate_key`(`userId`, `annualLeaveType`, `localDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AnnualLeaveHistory` ADD CONSTRAINT `AnnualLeaveHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
