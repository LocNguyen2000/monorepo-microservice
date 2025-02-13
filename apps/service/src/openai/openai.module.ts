import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { OpenAIController } from './openai.controller';

@Module({
  imports: [],
  controllers: [OpenAIController],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
