import { Inject, PipeTransform, mixin, Type } from '@nestjs/common';
import { Uploaded } from '@/interceptor/multi-part.interceptor';
import { CloudinaryService } from './cloudinary.service';

export function CloudinaryPipe(fieldName?: string): Type<PipeTransform> {
  class MixinPipe implements PipeTransform {
    constructor(
      @Inject(CloudinaryService)
      private readonly cloudinaryService: CloudinaryService
    ) {}

    async transform(body: Record<string, unknown>): Promise<unknown> {
      if (fieldName && typeof body[fieldName] !== 'undefined') {
        const value = body[fieldName];
        body[fieldName] = await (Array.isArray(value)
          ? Promise.all(value.map(this.upload.bind(this)))
          : this.upload(value));
      }
      return body;
    }

    async upload(value: unknown) {
      if (value && typeof value === 'object' && 'path' in value) {
        return this.cloudinaryService
          .handleUploaded(value as Uploaded)
          .toPromise()
          .then(response => response?.secure_url);
      }
      return value;
    }
  }

  return mixin(MixinPipe);
}
