import { INestApplication } from '@nestjs/common';
import type { Schema$Authenticated } from '@/typings';
import supertest from 'supertest';
import 'jest-extended';

declare global {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;

  let root: Schema$Authenticated;
  let admin: Schema$Authenticated;
  let author: Schema$Authenticated;
  let client: Schema$Authenticated;

  namespace NodeJS {
    interface Global {
      app: INestApplication;
      request: supertest.SuperTest<supertest.Test>;

      root: Schema$Authenticated;
      admin: Schema$Authenticated;
      author: Schema$Authenticated;
      client: Schema$Authenticated;
    }
  }
}
