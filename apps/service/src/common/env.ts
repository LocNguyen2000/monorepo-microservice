import { GlobalEnv } from '@nhl/env';
import { IsNumber, IsObject, IsString, IsUrl } from 'class-validator';

class OpenAIRateLimit {
  @IsNumber()
  perDay: number;

  @IsNumber()
  perMinute: number;
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
}
