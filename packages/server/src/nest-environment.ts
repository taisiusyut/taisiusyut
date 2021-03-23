import methods from 'methods'; // supertest dependcy
import mongoose from 'mongoose';
import supertest from 'supertest';
import NodeEnvironment from 'jest-environment-node';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from './app.module';
import { setupApp, fastifyAdapter, NestFastifyApplication } from './setup';
import { ValidationHeader } from './constants';

// set default headers, for access guard
const createRequest = (app: any) => {
  const test = supertest(app);
  methods.forEach(method => {
    const defaultMethod = test[method as keyof typeof test] as (
      ...args: any
    ) => supertest.SuperAgentTest;
    (test as any)[method] = function (...args: any[]) {
      const request = defaultMethod.call(this, ...args);
      request.set('referer', 'referer');
      request.set(ValidationHeader, ValidationHeader);
      return request;
    };
  });
  return test;
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

      const request = createRequest(app.getHttpServer());

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
