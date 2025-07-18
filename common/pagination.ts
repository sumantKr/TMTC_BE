import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from "class-validator";
import SuccessResponse, { ISuccessResponse } from "./SuccessResponse";

export class PaginatedQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}

export class DateRangePaginationDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export interface IPaginatedResponse extends ISuccessResponse {
  total: number;
  page: number;
  limit: number;
}

export class PaginatedResponse extends SuccessResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  constructor({
    data,
    total,
    page,
    limit,
    message,
    status,
    redirectUrl,
  }: IPaginatedResponse) {
    super({ data, message, status, redirectUrl });
    this.meta = {
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
