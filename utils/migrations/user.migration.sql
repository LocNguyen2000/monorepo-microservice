-- Active: 1677815117468@@127.0.0.1@3306

create database if not exists users;

use users;

create table
    if not exists roles(
        `id`: int NOT NULL,
        `role`: varchar(50) NOT NULL,
        `createdAt` datetime DEFAULT NULL,
        `updatedAt` datetime DEFAULT NULL,
        `createdBy` varchar(50) DEFAULT NULL,
        `updatedBy` varchar(50) DEFAULT NULL,
        PRIMARY KEY (`id`),
    ) COMMENT '';

create table
    if not exists users(
        `id`: int NOT NULL,
        `username`: varchar(50) NOT NULL,
        `password`: varchar(100) NOT NULL,
        `role`: varchar(50) NOT NULL,
        PRIMARY KEY (`id`),
    ) COMMENT '';

create table
    if not exists employees(
        `employeeNumber` int NOT NULL,
        `lastName` varchar(50) NOT NULL,
        `firstName` varchar(50) NOT NULL,
        `extension` varchar(10) NOT NULL,
        `email` varchar(100) NOT NULL,
        `officeCode` varchar(10) NOT NULL,
        `reportsTo` int DEFAULT NULL,
        `jobTitle` varchar(50) NOT NULL,
        `role` int DEFAULT NULL,
        `createdAt` datetime DEFAULT NULL,
        `updatedAt` datetime DEFAULT NULL,
        `createdBy` varchar(50) DEFAULT NULL,
        `updatedBy` varchar(50) DEFAULT NULL,
        PRIMARY KEY (`employeeNumber`),
    ) COMMENT '';