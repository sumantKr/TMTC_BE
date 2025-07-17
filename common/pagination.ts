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

export class PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  constructor(data: T[], total: number, page: number, limit: number) {
    console.debug("🚀 ~ PaginatedResponse<T> ~ constructor ~ limit:", limit);
    console.debug("🚀 ~ PaginatedResponse<T> ~ constructor ~ page:", page);
    console.debug("🚀 ~ PaginatedResponse<T> ~ constructor ~ total:", total);
    this.data = data;
    this.meta = {
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
