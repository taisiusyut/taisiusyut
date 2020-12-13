import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from './app.module';
import { setupApp, fastifyAdapter, NestFastifyApplication } from './setup';
import NodeEnvironment from 'jest-environment-node';
import supertest from 'supertest';
import mongoose from 'mongoose';

export default class NestNodeEnvironment extends NodeEnvironment {
  mongod = new MongoMemoryServer();

  async setup(): Promise<void> {
    await super.setup();
    try {
      const MONGODB_URI = await this.mongod.getUri();
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule.init({ MONGODB_URI })]
      }).compile();

      const app = moduleFixture.createNestApplication<NestFastifyApplication>(
        fastifyAdapter()
      );

      setupApp(app);

      await app.init();
      await app.getHttpAdapter().getInstance().ready();

      const request = supertest(app.getHttpServer());

      this.global.app = app;
      this.global.request = request;
    } catch (error) {
      console.error(error);
      await this.mongod.stop();
    }
  }

  async teardown(): Promise<void> {
    await this.global.app.close();
    await mongoose.connection.close();
    await this.mongod.stop();
    await super.teardown();
  }
}
