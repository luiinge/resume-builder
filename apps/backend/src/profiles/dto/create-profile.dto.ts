import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength, ValidateNested } from 'class-validator';
import { PersonalDataDto } from './personal-data.dto';

export class CreateProfileDto {
  @ApiProperty({
    description: 'Nombre identificativo del perfil (no visible en el CV)',
  })
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ type: PersonalDataDto })
  @ValidateNested()
  @Type(() => PersonalDataDto)
  personalData!: PersonalDataDto;
}
