import { Module, DynamicModule } from '@nestjs/common';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseSerializerInterceptor } from '@/utils/mongoose';

const configure = (load: ConfigFactory[] = []) =>
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [
      '.env',
      '.env.local',
      `.env.${process.env.NODE_ENV}`,
      `.env.${process.env.NODE_ENV}.local`
    ],
    load
  });

@Module({})
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
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: MongooseSerializerInterceptor
        }
      ]
    };
  }
}
