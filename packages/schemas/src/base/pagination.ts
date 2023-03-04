import { IsNumber, IsOptional, IsPositive } from "class-validator";
import { Transform, plainToClass } from "class-transformer";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type PaginationResponse<I extends Iterable<any>> = Readonly<{
  page: number;
  offset: number;
  total: number;
  data: I;
}>;

export class FilterPagination {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsNumber()
  @IsPositive()
  page: number;

  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsNumber()
  size: number;
}

export const Pagination = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const paginateFilter = {
      page: request.query.page || 1,
      size: request.query.size || 10,
    };

    return plainToClass(FilterPagination, paginateFilter);
  }
);
