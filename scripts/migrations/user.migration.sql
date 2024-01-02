-- Active: 1677815117468@@127.0.0.1@3306

create database if not exists users;

use users;

create table
    if not exists roles(
        `id`: int NOT NULL,
        `role`: varchar(50) NOT NULL,
        `createdAt` datetime DEFAULT NOW(),
        `updatedAt` datetime DEFAULT NULL,
        `createdBy` varchar(50) DEFAULT 'admin',
        `updatedBy` varchar(50) DEFAULT NULL,
        PRIMARY KEY (`id`),
    ) COMMENT '';

insert into
    users.roles (id, role)
values ( (1, 'President'), (2, 'Manager'), (3, 'Employee')
    )

create table
    if not exists users(
        `id`: int NOT NULL,
        `username`: varchar(50) NOT NULL,
        `password`: varchar(100) NOT NULL,
        `role`: int NOT NULL,
        PRIMARY KEY (`id`),
        FOREIGN KEY (role) REFERENCES roles(id)
    ) COMMENT '';

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

-- Active: 1677815117468@@127.0.0.1@3307@users

insert into
    users.rent_providers (
        `createdAt`,
        `updatedAt`,
        `createdBy`,
        `updatedBy`,
        `providerCode`,
        `firstName`,
        `lastName`,
        `providerName`,
        role,
        `dateOfBirth`,
        `genderName`,
        `phoneNumber`,
        `email`,
        `contactAdress`
    )
values (
        now(),
        now(),
        'admin',
        'admin',
        1,
        'Huu Loc',
        'Nguyen',
        'Nguyen Huu Loc',
        1,
        DATE('2000-12-04'),
        'Male',
        '0384696172',
        'locnguyenhuu2k@gmail.com',
        'Nguyen Phong Sac'
    )