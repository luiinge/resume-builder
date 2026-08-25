import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CV_LANGUAGES } from '@resume-builder/shared';
import type { CvLanguage } from '@resume-builder/shared';

const CV_LANGUAGE_VALUES = CV_LANGUAGES.map((option) => option.value);

export class RenderCvDto {
  @ApiProperty({ description: 'ID del perfil a combinar' })
  @IsString()
  @IsNotEmpty()
  profileId!: string;

  @ApiProperty({ description: 'ID de la plantilla a aplicar' })
  @IsString()
  @IsNotEmpty()
  templateId!: string;

  @ApiPropertyOptional({
    description:
      'Idioma de los literales fijos del CV (títulos de sección, "Presente"...). Por defecto, español.',
    enum: CV_LANGUAGE_VALUES,
  })
  @IsOptional()
  @IsIn(CV_LANGUAGE_VALUES)
  language?: CvLanguage;
}
