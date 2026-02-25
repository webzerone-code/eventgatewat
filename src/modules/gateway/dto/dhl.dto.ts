import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class DhlDto {
  @IsString()
  @IsNotEmpty()
  tracking_id: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @Exclude()
  carrier?: string;
}
