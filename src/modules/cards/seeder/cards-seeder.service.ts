import { Injectable, Logger } from '@nestjs/common';
import { Card } from '@prisma/client';
import { DatabaseService } from 'src/providers/database/database.service';
import { cards } from './cards-seeder-data';

@Injectable()
export class CardsSeederService {
  private readonly logger = new Logger(CardsSeederService.name);
  constructor(private readonly dbContext: DatabaseService) {}

  async seed() {
    await this.useCardsCreator()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding cards...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding cards...');
        Promise.reject(error);
      });
  }

  private async useCardsCreator() {
    return await Promise.all(this.cardsCreator())
      .then((createdCards) => {
        this.logger.debug(
          'No of cards created: ' +
            createdCards.filter(
              (nullValueOrCreatedCard) => nullValueOrCreatedCard,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }

  private cardsCreator(): Array<Promise<Card>> {
    return cards.map(async (card: Card) => {
      return await this.dbContext.card
        .findFirst({
          where: {
            code: card.code,
          },
        })
        .then((dbCard) => {
          if (dbCard) {
            return Promise.resolve(null);
          }
          return Promise.resolve(this.dbContext.card.create({ data: card }));
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
