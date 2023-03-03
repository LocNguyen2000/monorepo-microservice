import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DbConnection } from './common';
import { EnvModule, EnvService } from '@nhl/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from '@nhl/env/common';
@Module({
  imports: [
    EnvModule.register(),
    TypeOrmModule.forRootAsync({
      name: DbConnection.Auth,
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService<Env>) => ({
        url: env.get('db.sqlUrl'),
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
