import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsString } from "class-validator";
import { BaseEntity } from "../base";

@Entity({ name: "auth_tokens" })
export class AuthToken extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: String })
  @IsString()
  accessToken: string;

  @Column({ type: String })
  @IsString()
  refreshToken: string;
}
