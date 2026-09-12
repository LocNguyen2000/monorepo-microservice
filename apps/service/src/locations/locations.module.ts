import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { ExpenseLocationSchema, LocationSchema } from '../common/schema/user';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilePostModule } from '../filepost/filepost.module';

@Module({
  imports: [
    SequelizeModule.forFeature([LocationSchema, ExpenseLocationSchema]),
    FilePostModule,
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
