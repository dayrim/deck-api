import { Module } from '@nestjs/common';
import { CardsModule } from './modules/cards/cards.module';
import { DeckModule } from './modules/deck/deck.module';

@Module({
  imports: [CardsModule, DeckModule],
})
export class AppModule {}
