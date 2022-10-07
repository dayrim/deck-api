import { ApiProperty } from '@nestjs/swagger';
import { DeckType } from '@prisma/client';

export class CreateDeckRequestDto {
  @ApiProperty()
  shuffled: boolean;
  @ApiProperty({ enum: DeckType })
  type: DeckType;
}
