import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { EnvModule, EnvService } from '@nhl/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from '@nhl/env/common';
import { NodeEnv } from '@nhl/env/common/enum';
import { User } from '@nhl/schemas/user';

@Module({
  imports: [
    EnvModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService<Env>) => ({
        type: 'mysql',
        url: env.get('db.sqlUrl'),
        synchronize: process.env.NODE_ENV !== NodeEnv.Prod,
        entities: [User],
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
