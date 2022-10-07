import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CardsSeederService } from './modules/cards/seeder/cards-seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cardsSeeder = app.get(CardsSeederService);
  await cardsSeeder.seed();

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
