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
        `employeeCode` int NOT NULL,
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
        PRIMARY KEY (`employeeCode`),
    ) COMMENT '';

-- Active: 1677815117468@@127.0.0.1@3307@users

insert into
    users.employees (
        `createdAt`,
        `updatedAt`,
        `createdBy`,
        `updatedBy`,
        `employeeCode`,
        `firstName`,
        `lastName`,
        `employeeName`,
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
        'President',
        DATE('2000-12-04'),
        'Male',
        '0384696172',
        'locnguyenhuu2k@gmail.com',
        'Nguyen Phong Sac'
    )
insert into
    users.roles (id, role)
values
( (1, 'President'), (2, 'Manager'), (3, 'Employee')
    )