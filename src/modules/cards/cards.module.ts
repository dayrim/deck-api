import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database/database.module';
import { CardsController } from './cards.controller';
import { CardsSeederService } from './seeder/cards-seeder.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CardsController],
  providers: [CardsSeederService],
  exports: [CardsSeederService],
})
export class CardsModule {}
