-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone_no` VARCHAR(191) NULL,
    `nrc` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TradeMarkInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trademark` VARCHAR(191) NOT NULL,
    `trademark_sample` VARCHAR(191) NOT NULL,
    `applicant` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `classes` VARCHAR(191) NOT NULL,
    `goods_services` VARCHAR(191) NOT NULL,
    `no_ent_reg_cer` VARCHAR(191) NOT NULL,
    `nonlatin_char_trans` VARCHAR(191) NOT NULL,
    `trans_mean` VARCHAR(191) NOT NULL,
    `color_claim` VARCHAR(191) NOT NULL,
    `re_filling_date` DATETIME(3) NOT NULL,
    `re_filling_WIPO_no` VARCHAR(191) NOT NULL,
    `app_no` VARCHAR(191) NOT NULL,
    `off_fill_date` DATETIME(3) NOT NULL,
    `payment_WIPO_no` VARCHAR(191) NOT NULL,
    `other_procedure` VARCHAR(191) NOT NULL,
    `granting_date` DATETIME(3) NOT NULL,
    `reg_no` VARCHAR(191) NOT NULL,
    `time_renewal` VARCHAR(191) NOT NULL,
    `renewal_date` DATETIME(3) NOT NULL,
    `renewal_no` VARCHAR(191) NOT NULL,
    `val_period` DATETIME(3) NOT NULL,
    `date_of_public` DATETIME(3) NOT NULL,
    `exp_date` DATETIME(3) NOT NULL,
    `reason_exp` VARCHAR(191) NOT NULL,
    `tm2` VARCHAR(191) NOT NULL,
    `submittion_type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
