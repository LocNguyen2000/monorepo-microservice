import { Module } from '@nestjs/common';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { ExpenseSchema } from '../common/schema/user';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [SequelizeModule.forFeature([ExpenseSchema])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
