/*
  Warnings:

  - You are about to alter the column `submittion_type` on the `TradeMarkInfo` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Json`.

*/
-- AlterTable
ALTER TABLE `TradeMarkInfo` MODIFY `submittion_type` JSON NOT NULL;
