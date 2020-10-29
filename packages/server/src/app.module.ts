import { Module, DynamicModule } from '@nestjs/common';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseSerializerInterceptor } from '@/utils/mongoose';
import { AcessGuard } from '@/guard/access.guard';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import Joi from '@hapi/joi';

const configure = (load: ConfigFactory[] = []) =>
  ConfigModule.forRoot({
    load,
    isGlobal: true,
    envFilePath: [
      '.env',
      '.env.local',
      `.env.${process.env.NODE_ENV}`,
      `.env.${process.env.NODE_ENV}.local`
    ],
    validationSchema: Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
      JWT_SECRET: Joi.string().default('JWT_SECRET'),
      JWT_TOKEN_EXPIRES_IN_MINUTES: Joi.number().min(1).default(1),
      REFRESH_TOKEN_EXPIRES_IN_MINUTES: Joi.number().min(1).default(1),
      DEFAULT_USERNAME: Joi.string().default('admin'),
      DEFAULT_PASSWORD: Joi.string().default('admin')
    })
  });

@Module({
  imports: [AuthModule, UserModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MongooseSerializerInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: AcessGuard
    }
  ]
})
export class AppModule {
  static init(factory?: ConfigFactory[]): DynamicModule {
    return {
      module: AppModule,
      imports: [
        configure(factory),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>(
              'MONGODB_URI',
              'mongodb://localhost:27017/fullstack'
            ),
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
          })
        })
      ]
    };
  }
}
