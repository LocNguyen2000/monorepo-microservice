import { IsString, IsNumberString, IsUrl, IsDefined } from "class-validator";
import { ServiceDatabase } from "./database";

class AuthEnv {
  @IsString()
  jwtSecret: string;
}

export class GlobalEnv {
  @IsDefined()
  db: ServiceDatabase;

  @IsDefined()
  auth: AuthEnv;
}
