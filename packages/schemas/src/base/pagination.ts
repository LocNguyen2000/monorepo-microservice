import {
  IsNumber,
  IsOptional,
  IsPositive,
  validate,
  ValidationError,
} from "class-validator";
import { Transform, plainToClass } from "class-transformer";
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

export type PaginationResponse<I extends Iterable<any>> = Readonly<{
  page: number;
  offset: number;
  total: number;
  data: I;
}>;

export class FilterPagination {
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return 1;

    return parseInt(value);
  })
  @IsNumber()
  @IsPositive()
  page: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return 10;

    return parseInt(value);
  })
  @IsNumber()
  @IsPositive()
  size: number;
}

export const Pagination = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const paginateFilter = plainToClass(
      FilterPagination,
      {
        page: request.query.page,
        size: request.query.size,
      },
      {
        enableImplicitConversion: true,
      }
    );

    const errors: ValidationError[] = await validate(paginateFilter);

    if (errors.length > 0) {
      //Get the errors and push to custom array
      let validationErrors = errors.map((obj) =>
        Object.values(obj.constraints)
      );
      throw new HttpException(
        `Validation failed with following Errors: ${validationErrors}`,
        HttpStatus.BAD_REQUEST
      );
    }

    return paginateFilter;
  }
);
