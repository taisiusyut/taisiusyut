import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from './app.module';
import { setupApp, fastifyAdapter, NestFastifyApplication } from './setup';
import { ValidationHeader } from './constants';
import NodeEnvironment from 'jest-environment-node';
import mongoose from 'mongoose';
import supertest from 'supertest';

// console.log(Object.keys(supertest.Test));
const defaultSet = (supertest as any).Test.prototype.set;
(supertest as any).Test.prototype.set = function (
  field: string,
  value: string
) {
  defaultSet.call(this, 'referer', 'referer');
  defaultSet.call(this, ValidationHeader, ValidationHeader);
  return defaultSet.call(this, field, value);
};

export default class NestNodeEnvironment extends NodeEnvironment {
  mongod = new MongoMemoryServer();

  async setup(): Promise<void> {
    await super.setup();
    try {
      const MONGODB_URI = await this.mongod.getUri();
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule.init({ MONGODB_URI, WEB_VERSION: 'test' })]
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
      await mongoose.connection.close();
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
