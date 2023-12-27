import { IsString, IsOptional, IsDefined } from "class-validator";

class DatabaseEnv {
  @IsString()
  @IsOptional()
  mongoUrl: string;

  @IsString()
  @IsOptional()
  sqlUrl: string;
}

export class ServiceDatabase {
  @IsDefined()
  user: DatabaseEnv;
}
