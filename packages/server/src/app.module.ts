import path from 'path';
import mongoose from 'mongoose';
import Joi from '@hapi/joi';
import { Module, DynamicModule } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
  configValidation,
  Config
} from '@/config';
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
import { BookShelfModule } from '@/modules/book-shelf/book-shelf.module';
import { BugReportModule } from '@/modules/bug-report/bug-report.module';
import { AnnouncementModule } from '@/modules/announcement/announcement.module';

const envFilePath = [
  `.env.${process.env.NODE_ENV || 'development'}.local`,
  `.env.${process.env.NODE_ENV || 'development'}`,
  '.env.local',
  '.env'
].map(pathname => path.resolve(process.cwd(), pathname));

@Module({
  imports: [
    AuthModule,
    UserModule,
    BookModule,
    ChapterModule,
    CloudinaryModule,
    PaymentModule,
    BookShelfModule,
    BugReportModule,
    AnnouncementModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: Joi.object(configValidation)
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
  static init({ MONGODB_URI }: Config = {}): DynamicModule {
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
