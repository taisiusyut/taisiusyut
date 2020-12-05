import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseSerializerInterceptor } from '@/utils/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccessGuard } from '@/utils/access';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { BookModule } from '@/modules/book/book.module';
import { ChapterModule } from '@/modules/chapter/chapter.module';
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module';
import { PaymentModule } from '@/modules/payment/payment.module';
import { BookShelfModule } from './modules/book-shelf/book-shelf.module';
import mongoose from 'mongoose';
import Joi from '@hapi/joi';

interface Configs {
  MONGODB_URI?: string;
}

@Module({
  imports: [
    AuthModule,
    UserModule,
    BookModule,
    ChapterModule,
    CloudinaryModule,
    PaymentModule,
    BookShelfModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}.local`,
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local',
        '.env'
      ],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        CLOUDINARY_URL: Joi.string().optional().allow('').default(''),
        JWT_SECRET: Joi.string().default('JWT_SECRET'),
        JWT_TOKEN_EXPIRES_IN_MINUTES: Joi.number().min(1).default(15),
        REFRESH_TOKEN_EXPIRES_IN_MINUTES: Joi.number()
          .min(1)
          .default(7 * 24 * 60),
        DEFAULT_USERNAME: Joi.string().default('admin'),
        DEFAULT_PASSWORD: Joi.string().default('12345678'),
        MONGODB_URI: Joi.string().optional()
      })
    })
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MongooseSerializerInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: AccessGuard
    }
  ]
})
export class AppModule {
  static init({ MONGODB_URI }: Configs = {}): DynamicModule {
    return {
      module: AppModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            mongoose.set('toJSON', {
              virtuals: true, // clone '_id' to 'id'
              versionKey: false // remove '__v',
            });

            return {
              uri: MONGODB_URI || configService.get<string>('MONGODB_URI'),
              useNewUrlParser: true,
              useFindAndModify: false,
              useCreateIndex: true,
              useUnifiedTopology: true
            };
          }
        })
      ]
    };
  }
}
