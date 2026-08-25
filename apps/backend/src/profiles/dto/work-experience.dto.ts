import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWorkExperienceDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  company!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  position!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdateWorkExperienceDto extends PartialType(
  CreateWorkExperienceDto,
) {}
