import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class ReorderDto {
  @ApiProperty({
    type: [String],
    description: 'IDs de las entradas de la sección en el orden deseado',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  orderedIds!: string[];
}
