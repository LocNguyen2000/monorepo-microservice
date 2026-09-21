import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { RoleModel, RoleSchema } from '../common/schema/auth/role.js';
import { InjectModel } from '@nestjs/sequelize';
import { AccountModel, AccountSchema } from '../common/schema/auth/account.js';
import { EnvService } from '@nhl/env';
import { Env } from '../common/env.js';
import { createHmac, randomBytes, scrypt as callbackScrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { LoginDto, RegisterDto } from './auth.dto.js';

const scrypt = promisify(callbackScrypt);
const TOKEN_TTL_SECONDS = 24 * 60 * 60;

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(RoleSchema) private readonly roleModel: RoleModel,
        @InjectModel(AccountSchema) private readonly accountModel: AccountModel,
        private readonly env: EnvService<Env>,
    ) { }

    async register(input: RegisterDto) {
        const email = input.email.trim().toLowerCase();
        const existingAccount = await this.accountModel.findOne({ where: { email } });
        if (existingAccount) throw new ConflictException('Email is already registered');

        const password = await this.hashPassword(input.password);
        const account = await this.accountModel.create({
            fullName: input.fullName.trim(),
            email,
            password,
            role: 3,
            status: 1,
        } as AccountSchema);

        return this.createAuthResponse(account);
    }

    async login(input: LoginDto) {
        const email = input.email.trim().toLowerCase();
        const account = await this.accountModel.findOne({ where: { email } });
        if (!account || account.status !== 1 || !(await this.verifyPassword(input.password, account.password))) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.createAuthResponse(account);
    }

    verifyToken(token: string, secret: string): TokenPayload {
        const [encodedPayload, encodedSignature] = token.split('.');
        if (!encodedPayload || !encodedSignature) throw new Error('Malformed token');

        const expectedSignature = this.sign(encodedPayload, secret);
        const actual = Buffer.from(encodedSignature, 'base64url');
        const expected = Buffer.from(expectedSignature, 'base64url');
        if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
            throw new Error('Invalid signature');
        }

        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString()) as TokenPayload;
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Expired token');
        return payload;
    }

    private async createAuthResponse(account: AccountSchema) {
        const payload: TokenPayload = {
            sub: account.id,
            email: account.email,
            role: account.role,
            exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
        };
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const accessToken = `${encodedPayload}.${this.sign(encodedPayload, this.env.get('jwtSecret'))}`;

        return {
            accessToken,
            id: account.id,
            email: account.email,
            fullName: account.fullName,
            role: account.role,
        };
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = randomBytes(16).toString('hex');
        const derivedKey = await scrypt(password, salt, 64) as Buffer;
        return `${salt}:${derivedKey.toString('hex')}`;
    }

    private async verifyPassword(password: string, storedPassword: string): Promise<boolean> {
        const [salt, storedHash] = storedPassword.split(':');
        if (!salt || !storedHash) return false;
        const derivedKey = await scrypt(password, salt, 64) as Buffer;
        const expected = Buffer.from(storedHash, 'hex');
        return expected.length === derivedKey.length && timingSafeEqual(expected, derivedKey);
    }

    private sign(value: string, secret: string): string {
        return createHmac('sha256', secret).update(value).digest('base64url');
    }
}

export interface TokenPayload {
    sub: number;
    email: string;
    role: number;
    exp: number;
}