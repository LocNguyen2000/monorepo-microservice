import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { EnvModule } from '@nhl/env';

@Module({
  imports: [EnvModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
