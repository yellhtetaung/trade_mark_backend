/*
  Warnings:

  - Made the column `attachment` on table `TradeMarkInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `TradeMarkInfo` MODIFY `attachment` VARCHAR(191) NOT NULL;
