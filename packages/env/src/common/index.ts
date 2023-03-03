import {
  IsString,
  IsOptional,
  IsNumberString,
  IsUrl,
  IsDefined,
} from "class-validator";

class DatabaseEnv {
  @IsString()
  @IsOptional()
  mongoUrl: string;

  @IsString()
  @IsOptional()
  sqlUrl: string;
}

class GlobalEnv {
  @IsDefined()
  db: DatabaseEnv;
}

export class Env extends GlobalEnv {
  @IsString()
  @IsUrl()
  host: string;

  @IsNumberString()
  port: string;
}
