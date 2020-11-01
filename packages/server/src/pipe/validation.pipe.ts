import { FastifyRequest } from 'fastify';
import { REQUEST } from '@nestjs/core';
import {
  ArgumentMetadata,
  Inject,
  Injectable,
  ValidationPipe
} from '@nestjs/common';
import { UserRole } from '@/typings';

const defaultGroups = Object.values(UserRole).filter(
  (k): k is string => typeof k === 'string'
);

@Injectable()
export class ExtendedValidationPipe extends ValidationPipe {
  constructor(
    @Inject(REQUEST)
    private request?: FastifyRequest<any>
  ) {
    super({ transform: true });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    let role: UserRole;

    if (this.request) {
      role = ['GET', 'PATCH'].includes(this.request.method)
        ? this.request.user?.role
        : this.request.body?.role;
    }

    const groups = role ? [UserRole[role]] : defaultGroups;

    this.transformOptions = {
      ...this.transformOptions,
      groups
    };

    this.validatorOptions = {
      ...this.validatorOptions,
      groups
    };

    const result = await super.transform(value, metadata);

    return result;
  }
}
