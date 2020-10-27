import { applyDecorators, BadRequestException } from '@nestjs/common';
import {
  ValidateIf,
  IsString,
  MinLength,
  MaxLength,
  Matches
} from 'class-validator';
import {
  PASSWORD_EUQAL_TO_USERNAME,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_REGEX_MESSAGE
} from '@/constants';

export function IsPassword(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ValidateIf((payload: Record<string, unknown>, value) => {
      if (payload && payload.username && payload.username === value) {
        throw new BadRequestException(PASSWORD_EUQAL_TO_USERNAME);
      }
      return true;
    }),
    IsString(),
    MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_MIN_LENGTH_MESSAGE }),
    MaxLength(PASSWORD_MAX_LENGTH, { message: PASSWORD_MAX_LENGTH_MESSAGE }),
    Matches(PASSWORD_REGEX, {
      message: PASSWORD_REGEX_MESSAGE
    })
  );
}
