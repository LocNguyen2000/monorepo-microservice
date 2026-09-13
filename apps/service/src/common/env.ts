import { GlobalEnv } from '@nhl/env';
import { IsNumber, IsObject, IsString, IsUrl } from 'class-validator';

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

  @IsNumber()
  port: number;

  @IsObject()
  ai: AICredentials;

  @IsObject()
  filePost: FilePost;
}
