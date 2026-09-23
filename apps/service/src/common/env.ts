import { GlobalEnv } from '@nhl/env';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

class DatabaseSsl {
  @IsBoolean()
  @IsOptional()
  ca: boolean;
}

class Database {
  @IsString()
  @IsOptional()
  mongoUrl: string;

  @IsString()
  sqlUrl: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => DatabaseSsl)
  ssl: DatabaseSsl;
}

class AIRateLimit {
  @IsNumber()
  perDay: number;

  @IsNumber()
  perMinute: number;
}

class FilePostRateLimit {
  @IsNumber()
  perSecond: number;

  @IsNumber()
  perMonth: number;
}

class MailJSTemplate {
  @IsString()
  invoice: string;

  @IsString()
  invoiceSchedule: string;
}

class MailJS {
  @IsUrl()
  url: string;

  @IsString()
  userId: string;

  @IsString()
  serviceId: string;

  @IsString()
  adminEmail: string;

  @IsNumber()
  timeoutMs: number;

  @IsObject()
  template: MailJSTemplate;
}

export class FilePost {
  @IsUrl()
  url: string;

  @IsString()
  apiKey: string;

  @IsNumber()
  maxFileSizeMb: number;

  @IsObject()
  rateLimit: FilePostRateLimit;
}

export class AICredentials {
  @IsUrl()
  url: string;

  @IsString()
  model: string;

  @IsString()
  apiKey: string;

  @IsObject()
  rateLimit: AIRateLimit;
}

export class Env extends GlobalEnv {
  @IsUrl()
  host: string;

  @IsString()
  jwtSecret: string

  @IsNumber()
  port: number;

  @IsObject()
  @ValidateNested()
  @Type(() => Database)
  db: Database;

  @IsObject()
  ai: AICredentials;

  @IsObject()
  filePost: FilePost;

  @IsObject()
  mailjs: MailJS;
}
