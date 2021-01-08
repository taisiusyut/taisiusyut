import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { isMongoId } from 'class-validator';

interface Option {
  key?: string;
  optional?: boolean;
}

export const ObjectId = createParamDecorator(
  (option: string | Option = 'id', ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<FastifyRequest<Record<string, any>>>();

    const { key = 'id', optional = false } =
      typeof option === 'string' ? { key: option } : option;

    const value = request.params[key];

    if (
      (typeof key !== 'undefined' && optional) ||
      (typeof value === 'string' && isMongoId(value))
    ) {
      return value;
    }
    throw new BadRequestException('incorrect object id format');
  }
);
