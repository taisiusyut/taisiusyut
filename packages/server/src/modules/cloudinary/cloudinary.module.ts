import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  exports: [CloudinaryService],
  controllers: [CloudinaryController],
  providers: [CloudinaryService]
})
export class CloudinaryModule {}
