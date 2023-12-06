-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('Admin', 'User') NOT NULL DEFAULT 'User';
