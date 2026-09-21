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
import { ADMIN_ROLES, ROLES_KEY } from './auth.roles.js';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
        private readonly env: EnvService<Env>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const requiredRoles = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? ADMIN_ROLES;

        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.startsWith('Bearer ')
            ? authorization.slice(7)
            : undefined;

        if (!token) throw new UnauthorizedException('Authentication required');

        try {
            const payload = this.authService.verifyToken(token, this.env.get('jwtSecret'));
            request.user = await this.authService.getActiveTokenPayload(payload);
            if (requiredRoles?.length && !requiredRoles.includes(request.user.role)) {
                throw new UnauthorizedException('Administrator access required');
            }
            return true;
        } catch {
            if (requiredRoles?.length) throw new UnauthorizedException('Administrator access required');
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}