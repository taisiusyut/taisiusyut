import { EMPTY } from 'rxjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@/config';
import { Param$CloudinarySign, Schema$CloudinarySign } from '@/typings';
import cloudinary from 'cloudinary';

type RemovePayload = string | { public_id: string };

@Injectable()
export class CloudinaryService {
  private api_secret: string;

  constructor(private readonly configService: ConfigService) {
    const [api_key, api_secret, cloud_name] = this.parseCloudinaryURL();

    this.api_secret = api_secret;

    cloudinary.v2.config({ api_key, api_secret, cloud_name });
  }

  parseCloudinaryURL(): string[] {
    return this.configService
      .get<string>('CLOUDINARY_URL', '')
      .replace('cloudinary://', '')
      .split(/:|@/);
  }

  sign(params?: Param$CloudinarySign): Schema$CloudinarySign {
    const timestamp = Math.round(+new Date() / 1000);

    if (!this.api_secret) {
      throw new InternalServerErrorException(
        'CLOUDINARY_URL is not configured'
      );
    }

    return {
      timestamp,
      signature: cloudinary.v2.utils.api_sign_request(
        { timestamp, ...params },
        this.api_secret
      )
    };
  }

  remove(payload: RemovePayload | RemovePayload[]) {
    const source = Array.isArray(payload) ? payload : [payload];
    return Promise.all(
      source.map(async payload => {
        const public_id =
          typeof payload === 'string'
            ? /res.cloudinary.com/.test(payload)
              ? (payload.match(/[^/\\&?]+(?=(.\w{3,4})$)/) || [])[0]
              : undefined
            : payload.public_id;
        return public_id ? cloudinary.v2.uploader.destroy(public_id) : EMPTY;
      })
    );
  }
}
