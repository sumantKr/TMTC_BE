import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  min,
} from "class-validator";
import {
  DateRangePaginationDto,
  PaginatedQueryDto,
} from "../../common/pagination";

export class CreateItineraryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  @Min(1)
  budget: number;
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class ItineraryListDto extends PaginatedQueryDto {
  @IsOptional()
  @IsString()
  title: string;
}

export class ItineraryCalendarDto extends DateRangePaginationDto {
  @IsOptional()
  @IsString()
  title: string;
}

export class UpdateItineraryDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  destination?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  budget?: number;
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
export class ItineraryParamsDto {
  @IsMongoId()
  itineraryId: string;
}
