import path from 'path';
import dotenv from 'dotenv';
import { FastifyRequest } from 'fastify';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { AuthorController } from '@/modules/user/author.controller';
import { BookService } from '@/modules/book/book.service';
import { BookController } from '@/modules/book/book.controller';
import { AppModule } from './app.module';
import { fastifyAdapter } from './setup';
import { UserRole, UserStatus } from './typings';

const log = (...msg: string[]) =>
  Logger.log(msg.map(String).join(' '), 'cronjobs');

const envPaths = ['.env', '.env.local'].map(pathname =>
  path.resolve(process.cwd(), pathname)
);
for (const pathname of envPaths) {
  const { parsed } = dotenv.config({ path: pathname });
  for (const key in parsed) {
    process.env[key] = parsed[key];
  }
}

async function cronjob() {
  const app = await NestFactory.create(AppModule.init(), fastifyAdapter());
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  log(`app ready`);

  const userService = await app.resolve(UserService);
  const authorController = await app.resolve(AuthorController);
  const bookService = await app.resolve(BookService);
  const bookController = await app.resolve(BookController);

  const authors = await userService.findAll({
    role: UserRole.Author,
    status: UserStatus.Active
  });

  let progress = 0;

  for (const author of authors) {
    const req = {} as FastifyRequest;
    req.user = {
      username: '',
      nickname: '',
      role: UserRole.Author,
      user_id: String(author._id)
    };

    try {
      await authorController.bookCollection(req, String(author._id));
    } catch (error) {
      log(`update ${author.nickname} book collection failure`);
    }

    const books = await bookService.bookModel.find({
      author: String(author._id),
      $or: bookService.publicStatus
    });

    for (const book of books) {
      try {
        await bookController.wordCount(req, book.id);
      } catch (error) {
        log(
          `update ${author.nickname} book ${book.name} word count failure`,
          (error as Error).message
        );
      }
    }

    try {
      await authorController.updateWordCount(req, String(author._id));
    } catch (error) {
      log(`update ${author.nickname} word count failure`);
    }

    progress = progress + 1;

    log(`${progress}/${authors.length}`);
  }

  log('done');

  process.exit();
}

cronjob();
