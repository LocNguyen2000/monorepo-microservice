import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles, UserRole } from '../auth/auth.roles.js';
import { TokenPayload } from '../auth/auth.service.js';
import { ShareAccountDto } from './account-shares.dto.js';
import { AccountSharesService } from './account-shares.service.js';

@Controller('account-shares')
export class AccountSharesController {
  constructor(private readonly accountSharesService: AccountSharesService) {}

  @Roles(
    UserRole.SuperAdministrator,
    UserRole.Administrator,
    UserRole.User,
    UserRole.LocationOperator,
  )
  @Get()
  list(@Req() request: Request & { user: TokenPayload }) {
    return this.accountSharesService.listSharedAccounts(request.user.sub);
  }

  @Roles(UserRole.SuperAdministrator, UserRole.Administrator)
  @Post()
  share(
    @Body() input: ShareAccountDto,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.accountSharesService.shareAccount(request.user.sub, input.sharedAccountId);
  }

  @Roles(UserRole.SuperAdministrator)
  @Delete(':sharedAccountId')
  revoke(
    @Param('sharedAccountId', ParseIntPipe) sharedAccountId: number,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.accountSharesService.revokeShare(request.user.sub, sharedAccountId);
  }
}