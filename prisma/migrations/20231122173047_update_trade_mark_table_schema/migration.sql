/*
  Warnings:

  - You are about to alter the column `submittion_type` on the `TradeMarkInfo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `TradeMarkInfo` MODIFY `submittion_type` ENUM('Mark', 'OldMark', 'ReRegistration') NOT NULL;
