import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  exports: [CloudinaryService],
  providers: [CloudinaryService]
})
export class CloudinaryModule {}
