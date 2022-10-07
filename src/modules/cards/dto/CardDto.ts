import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CardDto {
  @Expose()
  @ApiProperty()
  value: string;
  @Expose()
  @ApiProperty()
  suit: string;
  @Expose()
  @ApiProperty()
  code: string;
}
