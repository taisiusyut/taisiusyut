import { Controller, Post } from '@nestjs/common';
import { routes } from '@/constants/routes';
import { Access } from '@/guard/access.guard';
import { CloudinaryService } from './cloudinary.service';

export const REFRESH_TOKEN_COOKIES = 'fullstack_refresh_token';

@Controller()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post(routes.cloudinary_sign)
  @Access('Jwt')
  cloudinarySign() {
    return this.cloudinaryService.sign();
  }
}
