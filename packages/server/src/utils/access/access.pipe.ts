import { FastifyRequest } from 'fastify';
import { classToClass } from 'class-transformer';
import { REQUEST } from '@nestjs/core';
import { Inject, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { permissonsMap } from './permission-config';

export class AccessPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: FastifyRequest<any>
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const role = this.request.user?.role;

    if (metadata.metatype && value instanceof metadata.metatype) {
      return classToClass(value, {
        groups: role && [role, ...permissonsMap[role]],

        /** Using @Group or @Expose with @Transform in DTO return `unedfined` property, */
        exposeUnsetFields: false
      });
    }

    return value;
  }
}
