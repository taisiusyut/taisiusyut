import { FastifyRequest } from 'fastify';
import { REQUEST } from '@nestjs/core';
import { Inject, mixin, PipeTransform, Type } from '@nestjs/common';
import { UserRole } from '@/typings';

/**
 *  Using @Group or @Expose and @Transform in DTO have conflict,
 *  So we need extra pipe transform
 */
export function BookStatusPipe(roles: UserRole[]): Type<PipeTransform> {
  class BookStatusPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST)
      private readonly request: FastifyRequest
    ) {}

    async transform(value: unknown): Promise<unknown> {
      const { user } = this.request;
      if (!user.role || !roles.includes(user.role)) {
        if (value && typeof value === 'object') {
          delete value['status'];
        }
      }
      return value;
    }
  }
  return mixin(BookStatusPipe);
}
