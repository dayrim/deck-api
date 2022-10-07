import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { HttpExceptionDto } from 'src/common/dto/HttpExceptionDto';
import { DatabaseService } from 'src/providers/database/database.service';
import { DrawCardRequestDto } from './dto/DrawCardRequsetDto';
import { DrawCardResponseDto } from './dto/DrawCardResponseDto';

@Controller('cards')
export class CardsController {
  constructor(private readonly dbContext: DatabaseService) {}

  @Post('draw')
  @ApiOkResponse({
    schema: {
      type: 'object',
      $ref: getSchemaPath(DrawCardRequestDto),
      properties: {
        cards: {
          type: 'object',
          $ref: getSchemaPath(DrawCardResponseDto),
        },
      },
    },
    description: 'Returns drawn cards',
  })
  @ApiNotFoundResponse({
    type: HttpExceptionDto,
    description: 'Returns an error',
  })
  async draw(
    @Body() request: DrawCardRequestDto,
  ): Promise<DrawCardResponseDto> {
    const deckToCard = await this.dbContext.deckToCard.findMany({
      where: {
        deckId: request.deckId,
      },
      select: {
        card: true,
      },
      orderBy: {
        positionInDeck: 'asc',
      },
      take: request.count,
    });
    const cards = deckToCard.map((deckToCard) => deckToCard.card);

    if (!cards.length) throw new NotFoundException('Cards not found');
    await this.dbContext.deckToCard.deleteMany({
      where: {
        deckId: request.deckId,
        cardId: {
          in: cards.map((card) => card.id),
        },
      },
    });
    return plainToClass(
      DrawCardResponseDto,
      { cards },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
