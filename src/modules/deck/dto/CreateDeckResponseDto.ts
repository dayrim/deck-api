import { ApiProperty } from '@nestjs/swagger';
import { DeckType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
export class CreateDeckResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.id)
  deckId: string;
  @Expose()
  @ApiProperty({ enum: DeckType })
  type: DeckType;
  @ApiProperty()
  @Expose()
  shuffled: boolean;
}
