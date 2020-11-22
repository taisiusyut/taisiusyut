import { from, of, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import {
  Inject,
  SetMetadata,
  ExecutionContext,
  CustomDecorator
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '@/typings';
import { permissonsMap } from '@/permissions';

type AccessType =
  | Permissions
  | 'Everyone'
  | 'Auth' // registered
  | 'Optional'; // registered or everyone

const AccessMetakey = 'AccessMeta';

export const Access = (
  ...access: Exclude<AccessType, 'Auth'>[] | ['Auth'] | ['Optional']
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
    ) || ['Auth'];

    if (access.includes('Everyone')) {
      return of(true);
    }

    const canActivate = super.canActivate(context);

    const canActivate$ =
      typeof canActivate === 'boolean' ? of(canActivate) : from(canActivate);

    return canActivate$.pipe(
      catchError(() => of(false)),
      mergeMap<boolean, Promise<boolean>>(async activate => {
        if (access.includes('Optional')) return true;

        if (activate) {
          if (access.includes('Auth')) return true;

          const req = context.switchToHttp().getRequest<FastifyRequest>();

          if (!!req.user?.role) {
            const permissions = permissonsMap[req.user.role];
            return access.every(a => permissions.includes(a as Permissions));
          }
        }
        return false;
      })
    );
  }
}
