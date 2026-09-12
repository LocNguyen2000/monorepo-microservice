import { Module } from '@nestjs/common';
import { FilePostService } from './filepost.service';

@Module({
  providers: [FilePostService],
  exports: [FilePostService],
})
export class FilePostModule {}
