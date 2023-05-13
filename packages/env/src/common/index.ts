import { IsString, IsNumberString, IsUrl, IsDefined } from "class-validator";
import { ServiceDatabase } from "./database";

class AuthEnv {
  @IsString()
  signature: string;
}

class GlobalEnv {
  @IsDefined()
  db: ServiceDatabase;

  @IsDefined()
  auth: AuthEnv;
}

export class Env extends GlobalEnv {
  @IsString()
  @IsUrl()
  host: string;

  @IsNumberString()
  port: string;
}
