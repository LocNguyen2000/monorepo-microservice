import { GlobalEnv } from '@nhl/env';
import { IsNumber, IsObject, IsString, IsUrl } from 'class-validator';

class OpenAIRateLimit {
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

export class OpenAI {
  @IsUrl()
  url: string;

  @IsString()
  model: string;

  @IsString()
  apiKey: string;

  @IsObject()
  rateLimit: OpenAIRateLimit;
}

export class Env extends GlobalEnv {
  @IsUrl()
  host: string;

  @IsNumber()
  port: number;

  @IsObject()
  openAi: OpenAI;

  @IsObject()
  filePost: FilePost;
}
