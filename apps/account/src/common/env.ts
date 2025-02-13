import { GlobalEnv } from '@nhl/env';
import { IsNumber, IsObject, IsString, IsUrl } from 'class-validator';

class TemplateEnv {
  @IsString()
  register: string;

  @IsString()
  login: string;
}

export class MailJS {
  @IsUrl()
  url: string;

  @IsString()
  userId: string;

  @IsObject()
  template: TemplateEnv;

  @IsString()
  serviceId: string;
}

export class Env extends GlobalEnv {
  @IsUrl()
  host: string;

  @IsNumber()
  port: number;

  @IsObject()
  mailjs: MailJS;
}
