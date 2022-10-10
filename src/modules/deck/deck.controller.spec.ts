import { Test, TestingModule } from '@nestjs/testing';
import { DeckController } from './deck.controller';
import { DatabaseService as TestDatabaseService } from 'src/providers/database/test-database.service';
import { DatabaseModule } from 'src/providers/database/database.module';
import { DatabaseService } from 'src/providers/database/database.service';

describe('DeckController', () => {
  let controller: DeckController;
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
      providers: [DeckController],
    })
      .overrideProvider(DatabaseService)
      .useValue(dbCtx)
      .compile();

    controller = module.get<DeckController>(DeckController);

    await dbCtx.$executeRaw`DELETE FROM "DeckToCard"`;
    await dbCtx.$executeRaw`DELETE FROM "Deck"`;
    await dbCtx.$executeRaw`DELETE FROM "Card"`;

    for (const card of cards) {
      await dbCtx.card.create({
        data: card,
      });
    }
  });

  it('Creates a deck', async () => {
    const res = await controller.create({
      shuffled: false,
      type: 'FULL',
    });
    expect(res.deckId).toBeDefined();
    expect(res.shuffled).toBe(false);
    expect(res.type).toBe('FULL');
  });
  it('Opens a deck', async () => {
    const deck = await controller.create({
      shuffled: false,
      type: 'FULL',
    });
    const res = await controller.open({
      deckId: deck.deckId,
    });
    expect(res.deckId).toBeDefined();
    expect(res.shuffled).toBe(false);
    expect(res.type).toBe('FULL');
    expect(Array.isArray(res.cards)).toBe(true);
  });
});
