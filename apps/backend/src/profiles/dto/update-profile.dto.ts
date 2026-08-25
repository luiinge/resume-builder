import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PersonalDataDto } from './personal-data.dto';

class UpdatePersonalDataDto extends PartialType(PersonalDataDto) {}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ type: UpdatePersonalDataDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonalDataDto)
  personalData?: UpdatePersonalDataDto;
}
