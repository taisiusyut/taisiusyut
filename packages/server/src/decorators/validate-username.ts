import { applyDecorators } from '@nestjs/common';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MIN_LENGTH_MESSAGE,
  USERNAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH_MESSAGE,
  USERNAME_REGEX,
  USERNAME_REGEX_MESSAGE,
  USERNAME_BLACKLIST_REGEX,
  USERNAME_BLACKLIST_REGEX_MESSAGE
} from '@/constants';

export function IsUsername(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsString(),
    MinLength(USERNAME_MIN_LENGTH, { message: USERNAME_MIN_LENGTH_MESSAGE }),
    MaxLength(USERNAME_MAX_LENGTH, { message: USERNAME_MAX_LENGTH_MESSAGE }),
    Matches(USERNAME_REGEX, {
      message: USERNAME_REGEX_MESSAGE
    }),
    Matches(USERNAME_BLACKLIST_REGEX, {
      message: USERNAME_BLACKLIST_REGEX_MESSAGE
    })
  );
}
