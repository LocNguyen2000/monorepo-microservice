import { IsString, IsNumberString, IsUrl, IsDefined } from "class-validator";
import { DatabaseEnv } from "./database";

class AuthEnv {
  @IsString()
  jwtSecret: string;
}

export class GlobalEnv {
  @IsDefined()
  db: DatabaseEnv;

  @IsDefined()
  auth: AuthEnv;
}
