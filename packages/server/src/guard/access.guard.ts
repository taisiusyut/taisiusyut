import { from, of, Observable } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { Expose, ExposeOptions } from 'class-transformer';
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

type AccessType = keyof typeof UserRole | 'EVERYONE' | 'SELF' | 'PASSWORD';

export const Access = (...access: AccessType[]): CustomDecorator<string> =>
  SetMetadata('access', access);

export const Group = (
  groups: (keyof typeof UserRole)[],
  options?: ExposeOptions
): ReturnType<typeof Expose> => Expose({ groups, ...options });

export class AcessGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(Reflector) private reflector: Reflector,
    @Inject(AuthService) private readonly authService: AuthService
  ) {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const access =
      this.reflector.getAllAndOverride<AccessType[]>('access', [
        context.getHandler(),
        context.getClass()
      ]) || [];

    const canActive = super.canActivate(context);

    const authorized$ =
      typeof canActive === 'boolean' ? of(canActive) : from(canActive);

    const evenyone = access.includes('EVERYONE');

    return authorized$.pipe(
      catchError(() => of(evenyone)),
      mergeMap<boolean, Promise<boolean>>(async active => {
        if (active) {
          const req = context.switchToHttp().getRequest<FastifyRequest<any>>();
          const user_id: string | null = req.body?.user_id || req.params?.id;
          const user: Partial<JWTSignPayload> = req.user || {};

          if (access.includes('PASSWORD')) {
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

          if (access.includes('SELF') && user_id && user_id === user.user_id)
            return true;

          return evenyone || access.includes(UserRole[user.role] as AccessType);
        }
        return false;
      })
    );
  }
}
