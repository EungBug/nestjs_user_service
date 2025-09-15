-- CreateTable
CREATE TABLE `AttendanceHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `occurredAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `attendanceType` ENUM('CLOCK_IN', 'CLOCK_OUT') NOT NULL,
    `localDate` VARCHAR(191) NOT NULL,

    INDEX `AttendanceHistory_userId_occurredAt_idx`(`userId`, `occurredAt`),
    UNIQUE INDEX `AttendanceHistory_userId_attendanceType_localDate_key`(`userId`, `attendanceType`, `localDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AttendanceHistory` ADD CONSTRAINT `AttendanceHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
