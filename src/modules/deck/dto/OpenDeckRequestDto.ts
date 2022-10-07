import { ApiProperty } from '@nestjs/swagger';
export class OpenDeckRequestDto {
  @ApiProperty()
  deckId: string;
}
