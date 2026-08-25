import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { TemplateLayoutConfigDto } from './template-layout-config.dto';

export class CreateTemplateDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiProperty({ type: TemplateLayoutConfigDto })
  @ValidateNested()
  @Type(() => TemplateLayoutConfigDto)
  layoutConfig!: TemplateLayoutConfigDto;

  @ApiProperty({ description: 'Hoja de estilos CSS de la plantilla' })
  @IsString()
  @MaxLength(20000)
  css!: string;
}
