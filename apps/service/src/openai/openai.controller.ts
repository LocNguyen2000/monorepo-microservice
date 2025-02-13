import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAiService: OpenAiService) {}
  @Get('ping')
  ping(): string {
    return 'hello';
  }

  @Post('process-meter-image')
  @UseInterceptors(FilesInterceptor('files'))
  async processMeterImage(@UploadedFiles() file: Express.Multer.File) {
    if (!this.openAiService.isAllowAccess()) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Config limit exceeded',
      });
    }
    return await this.openAiService.processMeterImage(file);
  }
}
