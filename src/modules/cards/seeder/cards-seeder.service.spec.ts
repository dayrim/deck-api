import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from 'src/providers/database/database.module';
import { DatabaseService } from 'src/providers/database/database.service';
import { CardsSeederService } from './cards-seeder.service';
import { DatabaseService as TestDatabaseService } from 'src/providers/database/test-database.service';

describe('CardsSeederService', () => {
  let cardsSeeder: CardsSeederService;
  const dbCtx: TestDatabaseService = new TestDatabaseService();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [CardsSeederService],
    })
      .overrideProvider(DatabaseService)
      .useValue(dbCtx)
      .compile();

    cardsSeeder = module.get<CardsSeederService>(CardsSeederService);
    await dbCtx.$executeRaw`DELETE FROM "DeckToCard"`;
    await dbCtx.$executeRaw`DELETE FROM "Deck"`;
    await dbCtx.$executeRaw`DELETE FROM "Card"`;
  });

  it('should seed database with cards', async () => {
    await cardsSeeder.seed();
    const cards = await dbCtx.card.findMany();

    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBe(52);
  });
});
