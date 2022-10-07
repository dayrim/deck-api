import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database/database.module';
import { DeckController } from './deck.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [DeckController],
})
export class DeckModule {}
