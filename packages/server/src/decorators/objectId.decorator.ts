import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { isMongoId } from 'class-validator';

export const ObjectId = createParamDecorator(
  (key = 'id', ctx: ExecutionContext) => {
    const request: FastifyRequest<Record<
      string,
      string
    >> = ctx.switchToHttp().getRequest();
    const value = request.params[key];
    if (typeof value === 'string' && isMongoId(value)) {
      return value;
    }
    throw new BadRequestException('Incorrect object id format');
  }
);
