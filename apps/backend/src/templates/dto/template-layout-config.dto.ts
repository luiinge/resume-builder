import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  PERSONAL_DATA_FIELD_KEYS,
  SECTION_IDS,
  type PersonalDataFieldKey,
  type SectionId,
} from '@resume-builder/shared';

export class TemplateSectionConfigDto {
  @ApiProperty({ enum: SECTION_IDS })
  @IsIn(SECTION_IDS)
  section!: SectionId;

  @ApiProperty()
  @IsBoolean()
  visible!: boolean;

  @ApiProperty()
  @IsInt()
  @Min(1)
  column!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  order!: number;
}

export class TemplateLayoutConfigDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  columns!: number;

  @ApiProperty({ type: [TemplateSectionConfigDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TemplateSectionConfigDto)
  sections!: TemplateSectionConfigDto[];

  @ApiPropertyOptional({
    enum: PERSONAL_DATA_FIELD_KEYS,
    isArray: true,
    description:
      'Campos de datos personales visibles. Si se omite, se consideran todos visibles.',
  })
  @IsOptional()
  @IsArray()
  @IsIn(PERSONAL_DATA_FIELD_KEYS, { each: true })
  visiblePersonalDataFields?: PersonalDataFieldKey[];
}
