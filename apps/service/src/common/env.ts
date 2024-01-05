import { GlobalEnv } from '@nhl/env';
import { IsNumber, IsUrl } from 'class-validator';

export class Env extends GlobalEnv {
  @IsUrl()
  host: string;

  @IsNumber()
  port: number;
}
