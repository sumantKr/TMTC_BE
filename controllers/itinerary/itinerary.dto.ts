import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  min,
} from "class-validator";

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

export class UpdateItineraryDto extends CreateItineraryDto {}
export class ItineraryParamsDto {
  @IsMongoId()
  itineraryId: string;
}
