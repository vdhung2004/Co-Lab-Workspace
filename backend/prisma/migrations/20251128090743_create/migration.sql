-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `password_hash` TEXT NOT NULL,
    `role` ENUM('customer', 'admin') NOT NULL,
    `status` ENUM('active', 'locked') NOT NULL,
    `verified` BOOLEAN NOT NULL,
    `verify_token` VARCHAR(255) NULL,
    `verify_sent_at` DATETIME(0) NULL,
    `verify_expire_at` DATETIME(0) NULL,
    `reset_token` VARCHAR(255) NULL,
    `reset_sent_at` DATETIME(0) NULL,
    `reset_expire_at` DATETIME(0) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspaces` (
    `workspace_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `image_urls` JSON NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`workspace_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spaces` (
    `space_id` VARCHAR(191) NOT NULL,
    `workspace_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('desk', 'meeting_room') NOT NULL,
    `capacity` INTEGER NOT NULL,
    `price_hourly` DECIMAL(10, 2) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('available', 'maintenance') NOT NULL,
    `position_x` INTEGER NULL,
    `position_y` INTEGER NULL,
    `image_urls` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`space_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `amenities` (
    `amenity_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`amenity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `space_amenities` (
    `space_id` VARCHAR(191) NOT NULL,
    `amenity_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NULL,

    PRIMARY KEY (`space_id`, `amenity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `booking_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `space_id` VARCHAR(191) NOT NULL,
    `booker_email` VARCHAR(255) NULL,
    `booker_phone` VARCHAR(20) NULL,
    `booker_fullname` VARCHAR(100) NULL,
    `start_time` DATETIME(0) NOT NULL,
    `end_time` DATETIME(0) NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL,
    `cancellation_reason` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `payment_id` VARCHAR(191) NOT NULL,
    `booking_id` VARCHAR(191) NOT NULL,
    `provider` ENUM('momo', 'cash') NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `transaction_code` VARCHAR(255) NULL,
    `status` ENUM('pending', 'success', 'failed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payments_booking_id_key`(`booking_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refunds` (
    `refund_id` VARCHAR(191) NOT NULL,
    `payment_id` VARCHAR(191) NOT NULL,
    `processed_by` VARCHAR(191) NOT NULL,
    `refund_amount` DECIMAL(10, 2) NOT NULL,
    `refund_rate` INTEGER NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('pending', 'success', 'failed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refunds_payment_id_key`(`payment_id`),
    PRIMARY KEY (`refund_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `spaces` ADD CONSTRAINT `spaces_workspace_id_fkey` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`workspace_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `space_amenities` ADD CONSTRAINT `space_amenities_space_id_fkey` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`space_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `space_amenities` ADD CONSTRAINT `space_amenities_amenity_id_fkey` FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`amenity_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_space_id_fkey` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`space_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`payment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_processed_by_fkey` FOREIGN KEY (`processed_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
