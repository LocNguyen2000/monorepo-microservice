-- Active: 1677815117468@@127.0.0.1@3306

create database if not exists users;

use users;

-- Active: 1703494540009@@127.0.0.1@3307@users

create table
    if not exists roles(
        `id` int NOT NULL PRIMARY KEY,
        `role` varchar(50) NOT NULL,
        `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
        `createdBy` varchar(50) DEFAULT NULL,
        `updatedBy` varchar(50) DEFAULT NULL
    );

create table
    if not exists users(
        `id` int NOT NULL,
        `username` varchar(50) NOT NULL,
        `password` varchar(100) NOT NULL,
        `role` varchar(50) NOT NULL,
        PRIMARY KEY (`id`)
    );

create table
    if not exists rent_providers(
        `providerCode` int NOT NULL,
        `providerName` int NOT NULL,
        `lastName` varchar(50),
        `firstName` varchar(50),
        `email` varchar(100) NOT NULL,
        `role` int DEFAULT NULL,
        `dateOfBirth`: datetime,
        `phoneNumber` varchar(20),
        `contactAdress` varchar(100),
        `gender` int not null,
        `roomSize` int NOT NULL,
        `description` varchar(50),
        `createdAt` datetime DEFAULT NOW(),
        `updatedAt` datetime DEFAULT NULL,
        `createdBy` varchar(50) DEFAULT NULL,
        `updatedBy` varchar(50) DEFAULT NULL,
        PRIMARY KEY (`providerCode`)
    );

create table
    if not exists tenants(
        `tenantCode` int,
        `lastName` varchar(50),
        `firstName` varchar(50),
        `email` varchar(100) NOT NULL,
        `tenantName` int,
        `dateOfBirth`: datetime,
        `phoneNumber` varchar(20),
        `contactAdress` varchar(100),
        `gender` int not null,
        `roomateCount` int NOT NULL,
        `description` varchar(50),
        `createdAt` datetime DEFAULT NOW(),
        `updatedAt` datetime DEFAULT NULL,
        `createdBy` varchar(50) DEFAULT NULL,
        `updatedBy` varchar(50) DEFAULT NULL,
        PRIMARY KEY (`tenantCode`)
    )

insert into
    users.roles (id, role)
values (1, 'Administrator'), (2, 'Manager'), (3, 'Employee'), (4, 'Tenant')