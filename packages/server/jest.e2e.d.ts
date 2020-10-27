import { INestApplication } from '@nestjs/common';
import { SuperTest } from 'supertest';
import { SuperAgentRequest } from 'superagent';
import 'jest-extended';

declare global {
  let app: INestApplication;
  let request: SuperTest<SuperAgentRequest>;

  namespace NodeJS {
    interface Global {
      app: INestApplication;
      request: SuperTest<SuperAgentRequest>;
    }
  }
}
