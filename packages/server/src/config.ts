import path from 'path';
import Joi from '@hapi/joi';
import { ConfigService as DefaultConfigService } from '@nestjs/config';
import { ValidationHeader } from '@/constants';

export type Config = { [x in keyof typeof configValidation]?: any };

export const envFilePath = [
  `.env.${process.env.NODE_ENV || 'development'}.local`,
  `.env.${process.env.NODE_ENV || 'development'}`,
  '.env.local',
  '.env'
].map(pathname =>
  path.resolve(path.resolve(process.cwd(), '../../'), pathname)
);

export const configValidation = {
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  CLOUDINARY_URL: Joi.string().optional().allow('').default(''),
  COOKIE_SECRET: Joi.string().default('COOKIE_SECRET'),
  JWT_SECRET: Joi.string().default('JWT_SECRET'),
  JWT_TOKEN_EXPIRES_IN_MINUTES: Joi.number().min(1).default(15),
  REFRESH_TOKEN_EXPIRES_IN_MINUTES: Joi.number()
    .min(1)
    .default(7 * 24 * 60),
  DEFAULT_USERNAME: Joi.string().default('admin'),
  DEFAULT_PASSWORD: Joi.string().default('12345678'),
  MONGODB_URI: Joi.string().optional(),
  WEB_VERSION: Joi.string(),
  VALIDATION_HEADER: Joi.string().default(ValidationHeader)
};

export * from '@nestjs/config';

export class ConfigService extends DefaultConfigService<Config> {}
