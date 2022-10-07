import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CardsSeederService } from 'src/modules/cards/seeder/cards-seeder.service';
import { DatabaseService } from 'src/providers/database/database.service';
import { DatabaseService as TestDatabaseService } from 'src/providers/database/test-database.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // process.env.NODE_ENV = 'test';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [{ provide: DatabaseService, useClass: TestDatabaseService }],
    }).compile();
    app = moduleFixture.createNestApplication();
    const cardsSeeder = app.get(CardsSeederService);
    await cardsSeeder.seed();
    await app.init();
  });

  it('/deck/create (POST)', async () => {
    const res: request.Response = await request(app.getHttpServer())
      .post('/deck/create')
      .send({
        shuffled: false,
        type: 'FULL',
      });

    expect(res.status).toEqual(201);
    expect(res.body.deckId).toBeDefined();
    expect(res.body.shuffled).toBe(false);
    expect(res.body.type).toBe('FULL');
  });

  it('/deck/open (POST)', async () => {
    const deckCreatedResponse: request.Response = await request(
      app.getHttpServer(),
    )
      .post('/deck/create')
      .send({
        shuffled: false,
        type: 'SHORT',
      });

    expect(deckCreatedResponse.status).toEqual(201);
    expect(deckCreatedResponse.body.deckId).toBeDefined();
    expect(deckCreatedResponse.body.shuffled).toBe(false);
    expect(deckCreatedResponse.body.type).toBe('SHORT');

    const deckOpenedResponse: request.Response = await request(
      app.getHttpServer(),
    )
      .post('/deck/open')
      .send({
        deckId: deckCreatedResponse.body.deckId,
      });

    expect(deckOpenedResponse.status).toEqual(201);
    expect(deckOpenedResponse.body.deckId).toBeDefined();
    expect(deckOpenedResponse.body.shuffled).toBe(false);
    expect(deckOpenedResponse.body.type).toBe('SHORT');
    expect(Array.isArray(deckOpenedResponse.body.cards)).toBe(true);
    expect(deckOpenedResponse.body.cards.length).toBe(32);
  });

  it('/cards/draw (POST)', async () => {
    const deckCreatedResponse: request.Response = await request(
      app.getHttpServer(),
    )
      .post('/deck/create')
      .send({
        shuffled: false,
        type: 'SHORT',
      });

    expect(deckCreatedResponse.status).toEqual(201);
    expect(deckCreatedResponse.body.deckId).toBeDefined();
    expect(deckCreatedResponse.body.shuffled).toBe(false);
    expect(deckCreatedResponse.body.type).toBe('SHORT');

    const deckOpenedResponse: request.Response = await request(
      app.getHttpServer(),
    )
      .post('/cards/draw')
      .send({
        deckId: deckCreatedResponse.body.deckId,
        count: 3,
      });

    expect(Array.isArray(deckOpenedResponse.body.cards)).toBe(true);
    expect(deckOpenedResponse.body.cards.length).toBe(3);
  });
});
