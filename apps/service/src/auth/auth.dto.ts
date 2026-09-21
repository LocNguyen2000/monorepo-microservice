import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEnum } from 'class-validator';
import { UserRole } from './auth.roles.js';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UpdateRoleDto {
    @IsEnum(UserRole)
    role: UserRole;
}