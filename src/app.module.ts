import { Module } from '@nestjs/common';
import { CardsController } from './modules/cards/cards.controller';
import { CardsModule } from './modules/cards/cards.module';
import { CardsSeederService } from './modules/cards/seeder/cards-seeder.service';
import { DeckController } from './modules/deck/deck.controller';
import { DeckModule } from './modules/deck/deck.module';
import { DatabaseModule } from './providers/database/database.module';

@Module({
  imports: [CardsModule, DeckModule, DatabaseModule],
  controllers: [DeckController, CardsController],
  providers: [CardsSeederService],
})
export class AppModule {}
