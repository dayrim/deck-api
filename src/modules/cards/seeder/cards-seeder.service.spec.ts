import { Test, TestingModule } from '@nestjs/testing';
import { CardsSeederService } from './cards-seeder.service';

describe('CardsSeederService', () => {
  let service: CardsSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsSeederService],
    }).compile();

    service = module.get<CardsSeederService>(CardsSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
