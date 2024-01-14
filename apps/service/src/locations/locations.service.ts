import { Injectable } from '@nestjs/common';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationModel, LocationSchema } from '@nhl/schemas/user';
import { InjectModel } from '@nestjs/sequelize';
import { PaginatedQuery, paginatedQuery } from '~/common/pagination';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(LocationSchema)
    private readonly locationModel: LocationModel,
  ) {}

  async create(createLocationDto: Record<string, unknown>) {
    return this.locationModel.create(createLocationDto);
  }

  findAll(query: PaginatedQuery) {
    return paginatedQuery<LocationSchema>(this.locationModel, query);
  }

  findOne(id: number) {
    return this.locationModel.findByPk(id);
  }

  async update(id: number, payload: Record<string, unknown>) {
    const instance = await this.locationModel.findByPk(id);

    const response = await instance.update({ ...payload });
    return response;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
