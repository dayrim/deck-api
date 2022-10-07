import { ApiProperty } from '@nestjs/swagger';

export class DrawCardRequestDto {
  @ApiProperty()
  deckId: string;
  @ApiProperty()
  count: number;
}
