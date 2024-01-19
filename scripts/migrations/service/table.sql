-- Active: 1703494540009@@127.0.0.1@3307@services
create table if not exists rent_providers (
    `providerCode` int NOT NULL, `providerName` varchar(100) NOT NULL, `lastName` varchar(50), `firstName` varchar(50), `email` varchar(100) NOT NULL, `dateOfBirth` datetime DEFAULT NULL, `phoneNumber` varchar(20), `contactAddress` varchar(200), `gender` int not null, `description` varchar(50), `createdAt` datetime DEFAULT NOW(), `updatedAt` datetime DEFAULT NULL, `createdBy` varchar(50) DEFAULT NULL, `updatedBy` varchar(50) DEFAULT NULL, PRIMARY KEY (`providerCode`)
);

create table if not exists tenants (
    `tenantCode` int not null, `lastName` varchar(50), `firstName` varchar(50), `email` varchar(100) NOT NULL, `tenantName` varchar(100) NOT NULL, `dateOfBirth` datetime DEFAULT NULL, `phoneNumber` varchar(20), `contactAddress` varchar(200), `locationCode` int DEFAULT null, `gender` int not null, `roomateCount` int NOT NULL, `description` varchar(200), `createdAt` datetime DEFAULT NOW(), `updatedAt` datetime DEFAULT NULL, `createdBy` varchar(50) DEFAULT NULL, `updatedBy` varchar(50) DEFAULT NULL, PRIMARY KEY (`tenantCode`), CONSTRAINT FOREIGN KEY (locationCode) REFERENCES locations (locationCode)
);

create table if not exists locations (
    `locationCode` int not null, `locationName` varchar(100) not null, `locationAddress` varchar(200) not null, `roomSize` int NOT NULL, `description` varchar(200), `owner` int, `image` VARCHAR(100), `createdAt` datetime DEFAULT NOW(), `updatedAt` datetime DEFAULT NULL, `createdBy` varchar(50) DEFAULT NULL, `updatedBy` varchar(50) DEFAULT NULL, PRIMARY KEY (`locationCode`), CONSTRAINT FOREIGN KEY (`owner`) REFERENCES rent_providers (providerCode)
)

create table if not exists expenses {
    `id` int not null,
    `expenseName` VARCHAR(100) not null,
    `type` VARCHAR(100) not null,
    `price` int not null,
    `inUsed` BOOLEAN not null,
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL,
    `createdBy` varchar(50) DEFAULT NULL,
    `updatedBy` varchar(50) DEFAULT NULL,
}


create table if not exists expenses_location (
    `locationCode` int NOT null, `expenseCode` int NOT null, CONSTRAINT FOREIGN KEY (`locationCode`) REFERENCES locations (locationCode), CONSTRAINT FOREIGN KEY (`expenseCode`) REFERENCES expenses (expenseCode)
)