import { Body, Controller, Post } from '@nestjs/common';
import { routes } from '@/constants/routes';
import { Access } from '@/utils/access';
import { CloudinarySignDto } from './dto';
import { CloudinaryService } from './cloudinary.service';

@Controller()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post(routes.cloudinary_sign)
  @Access('cloudinary_sign')
  sign(@Body() dto: CloudinarySignDto) {
    return this.cloudinaryService.sign(dto);
  }
}
