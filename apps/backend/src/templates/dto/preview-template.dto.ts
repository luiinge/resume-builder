import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CV_LANGUAGES } from '@resume-builder/shared';
import type { CvLanguage } from '@resume-builder/shared';

const CV_LANGUAGE_VALUES = CV_LANGUAGES.map((option) => option.value);

export class PreviewTemplateDto {
  @ApiProperty({ description: 'ID del perfil a usar para la vista previa' })
  @IsString()
  @IsNotEmpty()
  profileId!: string;

  @ApiPropertyOptional({
    description: 'Idioma de los literales fijos del CV. Por defecto, español.',
    enum: CV_LANGUAGE_VALUES,
  })
  @IsOptional()
  @IsIn(CV_LANGUAGE_VALUES)
  language?: CvLanguage;
}
