import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { LocationSchema } from '@nhl/schemas/user';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([LocationSchema])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
