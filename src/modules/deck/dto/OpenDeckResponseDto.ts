import { ApiProperty } from '@nestjs/swagger';
import { DeckType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { CardDto } from '../../cards/dto/CardDto';

export class OpenDeckResponseDto {
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

  @Expose()
  @Transform(({ obj }) =>
    obj.deckToCard.flatMap((deckToCard) => deckToCard.card),
  )
  @ApiProperty()
  cards: CardDto[];
}
