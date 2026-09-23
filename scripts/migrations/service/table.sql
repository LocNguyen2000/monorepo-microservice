-- Active: 1703494540009@@127.0.0.1@3307@services
create table if not exists rent_providers (
    `providerCode` int NOT NULL,
    `providerName` varchar(100) NOT NULL,
    `lastName` varchar(50),
    `firstName` varchar(50),
    `email` varchar(100) NOT NULL,
    `dateOfBirth` datetime DEFAULT NULL,
    `phoneNumber` varchar(20),
    `contactAddress` varchar(200),
    `gender` int not null,
    `description` varchar(50),
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL,
    `createdBy` varchar(50) DEFAULT NULL,
    `updatedBy` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`providerCode`)
);

create table if not exists locations (
    `locationCode` int not null,
    `locationName` varchar(100) not null,
    `locationAddress` varchar(200) not null,
    `roomSize` int NOT NULL,
    `description` varchar(200),
    `owner` int,
    `image` VARCHAR(100),
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL,
    `createdBy` varchar(50) DEFAULT NULL,
    `updatedBy` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`locationCode`),
    CONSTRAINT FOREIGN KEY (`owner`) REFERENCES rent_providers (providerCode)
);

create table if not exists tenants (
    `tenantCode` int not null,
    `lastName` varchar(50),
    `firstName` varchar(50),
    `email` varchar(100) NOT NULL,
    `tenantName` varchar(100) NOT NULL,
    `dateOfBirth` datetime DEFAULT NULL,
    `phoneNumber` varchar(20),
    `contactAddress` varchar(200),
    `gender` int not null,
    `roomateCount` int NOT NULL,
    `description` varchar(200),
    `contractUrl` varchar(500),
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL,
    `createdBy` varchar(50) DEFAULT NULL,
    `updatedBy` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`tenantCode`)
);

create table if not exists expenses (
    `expenseCode` int not null,
    `expenseName` VARCHAR(100) not null, 
    `type` VARCHAR(100) not null,
    `price` int not null,
    `inUsed` BOOLEAN not null,
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL,
    `createdBy` varchar(50) DEFAULT NULL,
    `updatedBy` varchar(50) DEFAULT NULL,
    `unitName` VARCHAR(30) not null,
    PRIMARY KEY (`expenseCode`)
);  

create table if not exists expenses_location (
    `locationCode` int NOT null,
    `expenseCode` int NOT null,
    `initialUnit` int not null,
    `currentUnit` int not null,
    CONSTRAINT FOREIGN KEY (`locationCode`) REFERENCES locations (`locationCode`),
    CONSTRAINT FOREIGN KEY (`expenseCode`) REFERENCES expenses (`expenseCode`)
);

alter table tenants add column `contractUrl` varchar(500) default null;

create table if not exists tenant_locations (
    `tenantCode` int not null,
    `locationCode` int not null,
    PRIMARY KEY (`tenantCode`, `locationCode`),
    CONSTRAINT FOREIGN KEY (`tenantCode`) REFERENCES tenants (`tenantCode`),
    CONSTRAINT FOREIGN KEY (`locationCode`) REFERENCES locations (`locationCode`)
);

alter table expenses_location add column createdAt datetime DEFAULT NOW();
alter table expenses_location add column updatedAt datetime DEFAULT NULL;
alter table expenses_location add column createdBy varchar(50) DEFAULT NULL;
alter table expenses_location add column updatedBy varchar(50) DEFAULT NULL;

-- relocate tenant location code to tenant_location table

set @tenant_location_column = (
    select count(*)
    from information_schema.COLUMNS
    where TABLE_SCHEMA = database()
      and TABLE_NAME = 'tenants'
      and COLUMN_NAME = 'locationCode'
);
set @copy_tenant_locations = if(
    @tenant_location_column = 0,
    'select 1',
    'insert ignore into tenant_locations (tenantCode, locationCode) select tenantCode, locationCode from tenants where locationCode is not null'
);
prepare copy_tenant_locations from @copy_tenant_locations;
execute copy_tenant_locations;
deallocate prepare copy_tenant_locations;

set @tenant_location_fk = (
    select CONSTRAINT_NAME
    from information_schema.KEY_COLUMN_USAGE
    where TABLE_SCHEMA = database()
      and TABLE_NAME = 'tenants'
      and COLUMN_NAME = 'locationCode'
      and REFERENCED_TABLE_NAME = 'locations'
    limit 1
);
set @drop_tenant_location_fk = if(
    @tenant_location_fk is null,
    'select 1',
    concat('alter table tenants drop foreign key `', @tenant_location_fk, '`')
);
prepare drop_tenant_location_fk from @drop_tenant_location_fk;
execute drop_tenant_location_fk;
deallocate prepare drop_tenant_location_fk;

set @drop_tenant_location_column = if(
    @tenant_location_column = 0,
    'select 1',
    'alter table tenants drop column locationCode'
);
prepare drop_tenant_location_column from @drop_tenant_location_column;
execute drop_tenant_location_column;
deallocate prepare drop_tenant_location_column;

-- 
ALTER TABLE tenants 
DROP COLUMN roomateCount;

-- create invoice table


create table if not exists invoices (
    `invoiceCode` int not null auto_increment,
    `locationCode` int not null,
    `totalAmount` decimal(15, 2) not null default 0,
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL,
    `createdBy` varchar(50) DEFAULT NULL,
    `updatedBy` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`invoiceCode`),
    CONSTRAINT FOREIGN KEY (`locationCode`) REFERENCES locations (`locationCode`)
);

alter table invoices
modify column `status` enum('DRAFT', 'DONE') not null default 'DRAFT';

create table if not exists invoice_expenses (
    `invoiceExpenseCode` int not null auto_increment,
    `invoiceCode` int not null,
    `expenseCode` int not null,
    `expenseName` varchar(100) not null,
    `type` varchar(100) not null,
    `unitName` varchar(30),
    `initialUnit` decimal(15, 2) not null default 0,
    `currentUnit` decimal(15, 2) not null default 0,
    `unitPrice` decimal(15, 2) not null default 0,
    `amount` decimal(15, 2) not null default 0,
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL,
    `createdBy` varchar(50) DEFAULT NULL,
    `updatedBy` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`invoiceExpenseCode`),
    CONSTRAINT FOREIGN KEY (`invoiceCode`) REFERENCES invoices (`invoiceCode`),
    CONSTRAINT FOREIGN KEY (`expenseCode`) REFERENCES expenses (`expenseCode`)
);

create table if not exists invoice_schedules (
    `locationCode` int not null,
    `invoiceCode` int default null,
    `dueDay` int not null,
    `enabled` boolean not null default true,
    `lastNotifiedAt` datetime default null,
    `lastStatus` varchar(30) default null,
    `lastError` text default null,
    `createdAt` datetime default NOW(),
    `updatedAt` datetime default null,
    `createdBy` varchar(50) default null,
    `updatedBy` varchar(50) default null,
    PRIMARY KEY (`locationCode`),
    CONSTRAINT FOREIGN KEY (`locationCode`) REFERENCES locations (`locationCode`),
    CONSTRAINT FOREIGN KEY (`invoiceCode`) REFERENCES invoices (`invoiceCode`)
);

--- account table

create table if not exists accounts (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL UNIQUE, -- Ensures unique emails
    `password` VARCHAR(100) NOT NULL,
    `role` INT NOT NULL DEFAULT 0,
    `status` INT NOT NULL DEFAULT 0, -- 0 = pending approval, 1 = approved
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

create table if not exists sessions (
    `id` varchar(36) NOT NULL,
    `accountId` int NOT NULL,
    `expiresAt` datetime NOT NULL,
    `deletedAt` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT fk_session_account FOREIGN KEY (`accountId`) REFERENCES accounts(`id`)
);