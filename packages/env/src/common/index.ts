import { IsString, IsNumberString, IsUrl, IsDefined, IsEnum } from "class-validator";
import { DatabaseEnv } from "./database";

export enum Environment {
  Development = "dev",
  Staging = "staging",
  Production = "dev"
}

class AuthEnv {
  @IsString()
  jwtSecret: string;
}

export class GlobalEnv {
  @IsDefined()
  db: DatabaseEnv;

  @IsDefined()
  auth: AuthEnv;

  @IsDefined()
  @IsEnum(Environment)
  env: Environment
}
