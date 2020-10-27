import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

export const IsObjectId = (value: string): boolean =>
  checkForHexRegExp.test(value);

export const ObjectId = createParamDecorator(
  (key = 'id', ctx: ExecutionContext) => {
    const request: FastifyRequest = ctx.switchToHttp().getRequest();
    const value = request.params[key];
    if (typeof value === 'string' && IsObjectId(value)) {
      return value;
    }
    throw new BadRequestException('Incorrect object id format');
  }
);
