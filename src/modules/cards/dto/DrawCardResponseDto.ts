import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CardDto } from './CardDto';

export class DrawCardResponseDto {
  @ApiProperty()
  @Expose()
  @Type(() => CardDto)
  cards: CardDto[];
}
