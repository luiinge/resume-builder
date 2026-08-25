import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PersonalDataDto } from './personal-data.dto';
import { CreateSkillDto } from './skill.dto';
import { CreateLanguageDto } from './language.dto';
import { CreateEducationDto } from './education.dto';
import { CreateWorkExperienceDto } from './work-experience.dto';
import { CreateProjectDto } from './project.dto';

export class ImportProfileDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ type: PersonalDataDto })
  @ValidateNested()
  @Type(() => PersonalDataDto)
  personalData!: PersonalDataDto;

  @ApiPropertyOptional({ type: [CreateSkillDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDto)
  skills?: CreateSkillDto[];

  @ApiPropertyOptional({ type: [CreateLanguageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLanguageDto)
  languages?: CreateLanguageDto[];

  @ApiPropertyOptional({ type: [CreateEducationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDto)
  education?: CreateEducationDto[];

  @ApiPropertyOptional({ type: [CreateWorkExperienceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkExperienceDto)
  workExperience?: CreateWorkExperienceDto[];

  @ApiPropertyOptional({ type: [CreateProjectDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectDto)
  projects?: CreateProjectDto[];
}
