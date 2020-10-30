import { from, of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import {
  Inject,
  SetMetadata,
  ExecutionContext,
  CustomDecorator,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole, JWTSignPayload } from '@/typings';
import { AuthService } from '@/modules/auth/auth.service';

type AccessType =
  | keyof typeof UserRole
  | 'Everyone'
  | 'Self'
  | 'Password'
  | 'Role';

const AccessMetakey = 'access';

export const Access = (...access: AccessType[]): CustomDecorator<string> =>
  SetMetadata(AccessMetakey, access);

export function validateRole(target: UserRole, self?: UserRole) {
  if (self === UserRole.Root) return true;
  if (target === UserRole.Client) return true;
  if (target === UserRole.Author && self === UserRole.Admin) return true;
  return false;
}

export class AcessGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(Reflector) private reflector: Reflector,
    @Inject(AuthService) private readonly authService: AuthService
  ) {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const access =
      this.reflector.getAllAndOverride<AccessType[]>(AccessMetakey, [
        context.getHandler(),
        context.getClass()
      ]) || [];

    if (access.length === 0 || access.includes('Everyone')) {
      return of(true);
    }

    const canActivate = super.canActivate(context);

    const canActivate$ =
      typeof canActivate === 'boolean' ? of(canActivate) : from(canActivate);

    return canActivate$.pipe(
      mergeMap<boolean, Promise<boolean>>(async activate => {
        if (activate) {
          const req = context.switchToHttp().getRequest<FastifyRequest<any>>();
          const user_id: string | null = req.body?.user_id || req.params?.id;
          const user: Partial<JWTSignPayload> = req.user || {};

          if (access.includes('Password')) {
            const { password } = req.body;
            if (password) {
              try {
                const payload = await this.authService.validateUser(
                  user.username,
                  password
                );
                return !!payload;
              } catch (error) {
                throw new ForbiddenException();
              }
            } else {
              throw new BadRequestException();
            }
          }

          if (access.includes('Self') && user_id && user_id === user.user_id)
            return true;

          if (access.includes('Role') && req.body?.role) {
            const isValid = validateRole(req.body.role, user.role);
            if (isValid) {
              return true;
            }
            throw new ForbiddenException();
          }

          return access.includes(UserRole[user.role] as AccessType);
        }
        return false;
      })
    );
  }
}
