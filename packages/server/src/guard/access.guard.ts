import { from, of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import {
  Inject,
  SetMetadata,
  ExecutionContext,
  CustomDecorator
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole, JWTSignPayload } from '@/typings';

// TODO: add comment
type AccessType =
  | keyof typeof UserRole
  | 'Everyone'
  | 'Self'
  | 'Jwt'
  | 'Optional';

const AccessMetakey = 'AccessMeta';

export const Access = (
  ...access: Exclude<AccessType, 'Jwt'>[] | ['Jwt'] | ['Optional']
): CustomDecorator<string> => {
  return SetMetadata(AccessMetakey, access);
};

export class AcessGuard extends AuthGuard('jwt') {
  constructor(@Inject(Reflector) private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const access = this.reflector.getAllAndOverride<AccessType[]>(
      AccessMetakey,
      [context.getHandler(), context.getClass()]
    ) || ['Jwt'];

    if (access.includes('Everyone')) {
      return of(true);
    }

    const canActivate = super.canActivate(context);

    const canActivate$ =
      typeof canActivate === 'boolean' ? of(canActivate) : from(canActivate);

    return canActivate$.pipe(
      mergeMap<boolean, Promise<boolean>>(async activate => {
        if (access.includes('Optional')) return true;

        if (activate) {
          if (access.includes('Jwt')) return true;

          const req = context.switchToHttp().getRequest<FastifyRequest<any>>();
          const user_id: string | undefined = req.params?.id;
          const user: Partial<JWTSignPayload> = req.user || {};

          if (access.includes('Self') && user_id && user_id === user.user_id)
            return true;

          return (
            !!user.role && access.includes(UserRole[user.role] as AccessType)
          );
        }

        return false;
      })
    );
  }
}
