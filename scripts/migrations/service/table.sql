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