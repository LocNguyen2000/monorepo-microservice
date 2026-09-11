create database if not exists accounts;
use accounts;

create table if not exists accounts (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL UNIQUE, -- Ensures unique emails
    `password` VARCHAR(100) NOT NULL,
    `role` INT NOT NULL DEFAULT 0,
    `status` INT NOT NULL DEFAULT 0,
    CONSTRAINT CK_account_status_Range CHECK (`status` >= 0 AND `status` <= 1),
    PRIMARY KEY (`id`)
);


create table
    if not exists roles(
        `id` int NOT NULL PRIMARY KEY,
        `role` varchar(50) NOT NULL,
        `createdAt` datetime DEFAULT CURRENT_TIMESTAMP(),
        `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP(),
        `createdBy` varchar(50) DEFAULT NULL,
        `updatedBy` varchar(50) DEFAULT NULL
    );

ALTER TABLE accounts
ADD CONSTRAINT fk_account_role
FOREIGN KEY (`role`) 
REFERENCES roles(`id`)
ON DELETE CASCADE
ON UPDATE CASCADE;


create table
    if not exists clients(
        `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `name` varchar(30) NOT NULL,
        `clientId` varchar(36) NOT NULL,
        `clientSecret` varchar(100) NOT NULL,
        `redirectUris`varchar(100) NOT NULL,
        `accessTimeout` int NOT NULL,
        `refreshTimeout` int NOT NULL
    );


CREATE TABLE IF NOT EXISTS auth_codes (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` INT NOT NULL,
    `accountId` INT NOT NULL,
    `codeType` VARCHAR(20) NOT NULL COMMENT 'register_flow, login_flow',
    `expiresAt` BIGINT NOT NULL COMMENT 'UTC TIME',
    `createdAt` DATETIME DEFAULT NOW(),
    FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE CASCADE
);