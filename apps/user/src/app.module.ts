import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule } from '@nhl/env';
import { Env } from './common/env';
import { DatabaseModule } from './database/database.module';
import { RentProvidersModule } from './rent-providers/rent-providers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    EnvModule.register({ path: '/config/env.json', class: Env }),
    DatabaseModule,
    RentProvidersModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
