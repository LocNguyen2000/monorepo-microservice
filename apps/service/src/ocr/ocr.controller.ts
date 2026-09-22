import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { OcrService } from './ocr.service.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Roles, UserRole } from '../auth/auth.roles.js';

@Controller('openai')
export class OcrController {
  constructor(private readonly ocrService: OcrService) { }
  @Get('ping')
  ping(): string {
    return 'hello';
  }

  @Post('process-meter-image')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  @UseInterceptors(FilesInterceptor('files'))
  async processMeterImage(@UploadedFiles() file: Express.Multer.File) {
    return await this.ocrService.processMeterImage(file);
  }
}
