create database if not exists accounts;

use accounts;

create table
    if not exists accounts(
        `id` int NOT NULL,
        `username` varchar(50) NOT NULL,
        `password` varchar(100) NOT NULL,
        `role` varchar(50) NOT NULL,
        PRIMARY KEY (`id`)
    );

create table
    if not exists roles(
        `id` int NOT NULL PRIMARY KEY,
        `role` varchar(50) NOT NULL,
        `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
        `createdBy` varchar(50) DEFAULT NULL,
        `updatedBy` varchar(50) DEFAULT NULL
    );