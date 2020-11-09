import { FastifyRequest } from 'fastify';
import { classToClass } from 'class-transformer';
import { REQUEST } from '@nestjs/core';
import {
  Inject,
  PipeTransform,
  ArgumentMetadata,
  UnauthorizedException
} from '@nestjs/common';

/**
 *  Using @Group or @Expose with @Transform in DTO return `unedfined` property,
 *  So we need extra pipe transform
 */
export class AccessPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: FastifyRequest<any>
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // for user controller
    // TODO: check url instead of method type?
    const role = ['GET', 'PATCH'].includes(this.request.method)
      ? this.request.user?.role
      : this.request.body?.role;

    if (!role) {
      throw new UnauthorizedException();
    }

    if (metadata.metatype && value instanceof metadata.metatype) {
      const newValue = classToClass(value, {
        groups: [role]
      });

      for (const k in newValue) {
        const key = k as keyof typeof newValue;
        if (newValue[key] === undefined) {
          delete newValue[key];
        }
      }

      return newValue;
    }

    return value;
  }
}
