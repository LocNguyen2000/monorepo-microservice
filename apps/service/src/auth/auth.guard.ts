import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EnvService } from '@nhl/env';
import { Env } from '../common/env.js';
import { IS_PUBLIC_KEY } from './auth.constants.js';
import { AuthService } from './auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
        private readonly env: EnvService<Env>,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.startsWith('Bearer ')
            ? authorization.slice(7)
            : undefined;

        if (!token) throw new UnauthorizedException('Authentication required');

        try {
            request.user = this.authService.verifyToken(token, this.env.get('jwtSecret'));
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}