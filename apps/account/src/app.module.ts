import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule, EnvService } from '@nhl/env';
import { Env } from './common/env';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [
    EnvModule.register({ path: '/config/env.json', class: Env }),
    SequelizeModule.forRootAsync({
      inject: [EnvService],
      useFactory: async (env: EnvService<Env>) => {
        const { pathname, username, hostname, port } = new URL(
          env.get('db.sqlUrl'),
        );
        return {
          dialect: 'mysql',
          host: hostname,
          port: +port,
          username: username,
          database: pathname.replace('/', ''),
          models: [],
          sync: {
            force: true,
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
