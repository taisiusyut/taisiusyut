import { from, of, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import {
  Inject,
  SetMetadata,
  ExecutionContext,
  CustomDecorator,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@/config';
import { UserRole } from '@/typings';
import { ValidationHeader } from '@/constants';
import { Permission } from './permission-types';
import { permissonsMap } from './permission-config';

type AccessType =
  | Permission
  | UserRole
  | 'Everyone'
  | 'Auth' // registered
  | 'Optional'; // registered or everyone

const AccessMetakey = 'AccessMeta';

export const Access = (
  ...access: Exclude<AccessType, 'Auth'>[] | ['Auth'] | ['Optional']
): CustomDecorator<string> => {
  return SetMetadata(AccessMetakey, access);
};

export function canAccess(role: UserRole | undefined, access: AccessType[]) {
  if (role) {
    const permissions = permissonsMap[role];
    const types: AccessType[] = [role, ...permissions];
    return access.every(a => types.includes(a));
  }
  return false;
}

export class AccessGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(Reflector) private reflector: Reflector,
    private configService: ConfigService
  ) {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const access = this.reflector.getAllAndOverride<AccessType[]>(
      AccessMetakey,
      [context.getHandler(), context.getClass()]
    ) || ['Auth'];

    const http = context.switchToHttp();
    const req = http.getRequest() as FastifyRequest;

    if (
      !req.headers.referer ||
      req.headers[ValidationHeader] !==
        this.configService.get('VALIDATION_HEADER')
    ) {
      throw new ForbiddenException();
    }

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

          return canAccess(req.user?.role, access);
        }
        return false;
      })
    );
  }
}
