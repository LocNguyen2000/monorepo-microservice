import { IsString, IsOptional, IsDefined } from "class-validator";

export class DatabaseEnv {
  @IsString()
  @IsOptional()
  mongoUrl: string;

  @IsString()
  @IsOptional()
  sqlUrl: string;
}
