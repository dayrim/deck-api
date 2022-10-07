import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { HttpExceptionDto } from 'src/common/dto/HttpExceptionDto';
import { DatabaseService } from 'src/providers/database/database.service';
import { shuffleArray } from 'src/utils';
import { CardDto } from '../cards/dto/CardDto';
import { CreateDeckRequestDto } from './dto/CreateDeckRequestDto';
import { CreateDeckResponseDto } from './dto/CreateDeckResponseDto';
import { OpenDeckRequestDto } from './dto/OpenDeckRequestDto';
import { OpenDeckResponseDto } from './dto/OpenDeckResponseDto';

@Controller('deck')
@ApiExtraModels(OpenDeckResponseDto)
@ApiExtraModels(CreateDeckResponseDto)
export class DeckController {
  constructor(private readonly dbContext: DatabaseService) {}

  @Post('create')
  @ApiOkResponse({
    schema: {
      type: 'object',
      $ref: getSchemaPath(CreateDeckResponseDto),
    },
    description: 'Returns a deck of cards',
  })
  async create(
    @Body() request: CreateDeckRequestDto,
  ): Promise<CreateDeckResponseDto> {
    const cardQuery = Object.assign(
      {
        select: {
          id: true,
        },
      },
      request.type === 'SHORT'
        ? {
            where: {
              value: { notIn: ['2', '3', '4', '5', '6'] },
            },
          }
        : undefined,
    );

    const cards = await this.dbContext.card.findMany(cardQuery);

    if (request.shuffled) shuffleArray(cards);

    const deck = await this.dbContext.deck.create({
      data: {
        type: request.type,
        remaining: cards.length,
        shuffled: request.shuffled,
        deckToCard: {
          createMany: {
            data: cards.map((card, index) => ({
              cardId: card.id,
              positionInDeck: index + 1,
            })),
          },
        },
      },
    });
    return plainToClass(CreateDeckResponseDto, deck, {
      excludeExtraneousValues: true,
    });
  }

  @Post('open')
  @ApiOkResponse({
    schema: {
      type: 'object',
      $ref: getSchemaPath(OpenDeckResponseDto),
      properties: {
        cards: {
          type: 'array',
          items: {
            $ref: getSchemaPath(CardDto),
          },
        },
      },
    },
    description: 'Returns an opened deck of cards',
  })
  @ApiNotFoundResponse({
    type: HttpExceptionDto,
    description: 'Returns an error',
  })
  async open(
    @Body() request: OpenDeckRequestDto,
  ): Promise<OpenDeckResponseDto> {
    const deck = await this.dbContext.deck.findFirst({
      where: {
        id: request.deckId,
      },
      include: {
        deckToCard: {
          select: {
            card: true,
          },
          orderBy: {
            positionInDeck: 'asc',
          },
        },
      },
    });
    if (!deck) throw new NotFoundException('Deck not found');
    return plainToClass(OpenDeckResponseDto, deck, {
      excludeExtraneousValues: true,
    });
  }
}
