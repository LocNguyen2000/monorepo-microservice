import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationModel, LocationSchema } from '@nhl/schemas/user';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(LocationSchema)
    private readonly locationModel: LocationModel,
  ) {}

  create(createLocationDto: CreateLocationDto) {
    return 'This action adds a new location';
  }

  findAll() {
    return this.locationModel.findAll();
  }

  findOne(id: number) {
    return this.locationModel.findByPk(id);
  }

  async update(id: number, payload: UpdateLocationDto) {
    const instance = await this.locationModel.findByPk(id);

    const response = await instance.update({ ...payload });
    return response;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
