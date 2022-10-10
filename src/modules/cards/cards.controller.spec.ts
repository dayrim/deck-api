import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { DatabaseService as TestDatabaseService } from 'src/providers/database/test-database.service';
import { DatabaseModule } from 'src/providers/database/database.module';
import { DatabaseService } from 'src/providers/database/database.service';
import { Deck } from '@internal/prisma/client';

describe('CardsController', () => {
  let controller: CardsController;
  let deck: Deck;
  const cards = [
    {
      id: '6f46c883-25a9-4fd7-a42a-05253e9546dd',
      code: '9C',
      suit: 'CLUBS',
      value: '9',
    },
    {
      id: '67035dad-40a3-4ff2-b9ee-a1287b1062fe',
      code: '4H',
      suit: 'HEARTS',
      value: '4',
    },
    {
      id: 'b8906d80-731b-4b63-a6fb-faf5e1bae9ca',
      code: '8S',
      suit: 'SPADES',
      value: '8',
    },
  ];

  const dbCtx: TestDatabaseService = new TestDatabaseService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [CardsController],
    })
      .overrideProvider(DatabaseService)
      .useValue(dbCtx)
      .compile();

    controller = module.get<CardsController>(CardsController);

    deck = await dbCtx.deck.create({
      data: {
        type: 'SHORT',
        remaining: cards.length,
        shuffled: false,
      },
    });

    for (const [i, card] of cards.entries()) {
      await dbCtx.card.create({
        data: card,
      });
      await dbCtx.deckToCard.create({
        data: {
          deckId: deck.id,
          cardId: card.id,
          positionInDeck: i + 1,
        },
      });
    }
  });

  it('should draw 3 cards', async () => {
    const res = await controller.draw({ deckId: deck.id, count: 3 });
    expect(Array.isArray(res.cards)).toBe(true);
    expect(res.cards.length).toBe(3);
  });
});
