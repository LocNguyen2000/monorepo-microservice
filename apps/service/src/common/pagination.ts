import { IsNumber, IsObject } from 'class-validator';
import { Model, ModelCtor } from 'sequelize-typescript';
import { Expose, Transform, plainToClass } from 'class-transformer';
import { size } from 'lodash';

export class PaginatedQuery {
  //   @IsObject()
  //   filter?: Record<string, unknown>;

  @IsNumber()
  page?: number;

  @IsNumber()
  size?: number;
}

export class PaginatedResponse<M> {
  total: number;
  page: number;
  size: number;
  data: M[];
}

export async function paginatedQuery<T extends Model<any, any>>(
  model: ModelCtor<T>,
  filter: PaginatedQuery,
): Promise<PaginatedResponse<T>> {
  const transformFilter = plainToClass(PaginatedQuery, filter, {
    enableImplicitConversion: true,
  });

  console.log(transformFilter);

  const skip = transformFilter.page > 1 ? transformFilter.page - 1 : 0;
  const limit = transformFilter.size;

  const response = await model.findAndCountAll({
    offset: skip,
    limit,
  });

  return {
    total: response.count,
    page: transformFilter.page,
    size: transformFilter.size,
    data: response.rows,
  };
}
