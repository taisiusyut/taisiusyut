import { isObject } from 'class-validator';
import { ClassTransformOptions } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Model } from 'mongoose';
import { FastifyRequest } from 'fastify';
import {
  Type,
  Injectable,
  PlainLiteralObject,
  ExecutionContext,
  CallHandler,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { CLASS_SERIALIZER_OPTIONS } from '@nestjs/common/serializer/class-serializer.constants';
import { PaginateResult, UserRole } from '@/typings';
import { permissonsMap } from '@/utils/access';
import { TEXT_SCORE } from './mongoose-crud.service';

type Res =
  | PlainLiteralObject
  | Array<PlainLiteralObject>
  | PaginateResult<unknown>;

@Injectable()
export class MongooseSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this._getContextOptions(context);
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const role = req?.user?.role;

    const options = {
      ...this.defaultOptions,
      ...contextOptions
    };

    if (role) {
      options.groups = [
        ...(options.groups || []),
        UserRole[role],
        ...permissonsMap[role]
      ];
    }

    return next.handle().pipe(
      map((res: Res) =>
        this.serialize(res, {
          ...options,
          // remove _id field
          excludePrefixes: ['_']
        })
      )
    );
  }

  serialize(
    response: Res,
    options: ClassTransformOptions
  ): PlainLiteralObject | PlainLiteralObject[] {
    if (isObject(response) && 'data' in response && 'total' in response) {
      return {
        ...response,
        data: response.data.map((item: PlainLiteralObject) =>
          this.transformToPlain(item, options)
        )
      };
    }

    return super.serialize(response, options);
  }

  transformToPlain(
    plainOrClass: any,
    options: ClassTransformOptions
  ): PlainLiteralObject {
    if (plainOrClass instanceof Model) {
      plainOrClass = plainOrClass.toJSON();
    }

    const { [TEXT_SCORE]: textScore, ...plainObject } = super.transformToPlain(
      plainOrClass,
      options
    );

    // transform timestamp to number for NextJS
    if (plainObject.createdAt instanceof Date) {
      plainObject.createdAt = plainObject.createdAt.getTime();
    }

    if (plainObject.updatedAt instanceof Date) {
      plainObject.updatedAt = plainObject.updatedAt.getTime();
    }

    return plainObject;
  }

  _getContextOptions(
    context: ExecutionContext
  ): ClassTransformOptions | undefined {
    return (
      this._reflectSerializeMetadata(context.getHandler()) ||
      this._reflectSerializeMetadata(context.getClass())
    );
  }

  _reflectSerializeMetadata(
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj: Function | Type<any>
  ): ClassTransformOptions | undefined {
    return this.reflector.get(CLASS_SERIALIZER_OPTIONS, obj);
  }
}
