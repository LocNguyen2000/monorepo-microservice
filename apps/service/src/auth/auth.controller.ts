import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto, UpdateRoleDto, UpdateStatusDto } from './auth.dto.js';
import { Public } from './auth.decorator.js';
import { Roles, UserRole } from './auth.roles.js';
import { TokenPayload } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    register(@Body() input: RegisterDto) {
        return this.authService.register(input);
    }

    @Public()
    @Post('login')
    login(@Body() input: LoginDto) {
        return this.authService.login(input);
    }

    @Roles(UserRole.SuperAdministrator, UserRole.Administrator)
    @Get('pending')
    listPendingAccounts() {
        return this.authService.listPendingAccounts();
    }

    @Roles(UserRole.SuperAdministrator, UserRole.Administrator)
    @Get('accounts')
    listAccounts() {
        return this.authService.listAccounts();
    }

    @Roles(UserRole.SuperAdministrator, UserRole.Administrator)
    @Patch(':id/approve')
    approveAccount(@Param('id', ParseIntPipe) accountId: number, @Req() request: Request & { user: TokenPayload }) {
        return this.authService.approveAccount(accountId, request.user.sub);
    }

    @Roles(UserRole.SuperAdministrator)
    @Patch(':id/role')
    updateRole(
        @Param('id', ParseIntPipe) accountId: number,
        @Body() input: UpdateRoleDto,
        @Req() request: Request & { user: TokenPayload },
    ) {
        return this.authService.updateRole(accountId, input.role, request.user.sub);
    }

    @Roles(UserRole.SuperAdministrator)
    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) accountId: number,
        @Body() input: UpdateStatusDto,
        @Req() request: Request & { user: TokenPayload },
    ) {
        return this.authService.updateStatus(accountId, input.status, request.user.sub);
    }
}
