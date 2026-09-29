import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Roles, UserRole } from '../auth/auth.roles.js';
import {
  AssignableResourceType,
  AssignResourceAccountDto,
} from './resource-assignments.dto.js';
import { ResourceAssignmentsService } from './resource-assignments.service.js';

@Controller('admin/resources')
export class ResourceAssignmentsController {
  constructor(private readonly resourceAssignmentsService: ResourceAssignmentsService) {}

  @Roles(UserRole.SuperAdministrator)
  @Patch(':resourceType/:resourceId/account')
  assignAccount(
    @Param('resourceType', new ParseEnumPipe(AssignableResourceType))
    resourceType: AssignableResourceType,
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Body() input: AssignResourceAccountDto,
  ) {
    return this.resourceAssignmentsService.assignAccount(
      resourceType,
      resourceId,
      input.accountId,
    );
  }
}