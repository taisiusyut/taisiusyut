import { from, defer, of, empty, Observable } from 'rxjs';
import {
  concatMap,
  tap,
  retry,
  catchError,
  zipAll,
  mergeMap
} from 'rxjs/operators';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Schema$CloudinarySign } from '@/typings';
import cloudinary, {
  TransformationOptions,
  ConfigAndUrlOptions,
  UploadApiOptions,
  UploadApiResponse
} from 'cloudinary';
import { Uploaded } from '@/interceptor/multi-part.interceptor';
import fs from 'fs';

type RemovePayload = string | { public_id: string };
type UploadResponse = UploadApiResponse | null;

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

  sign(): Schema$CloudinarySign {
    const timestamp = Math.round(+new Date() / 1000);

    if (!this.api_secret) {
      throw new InternalServerErrorException(
        'CLOUDINARY_URL is not configured'
      );
    }

    return {
      timestamp,
      signature: cloudinary.v2.utils.api_sign_request(
        { timestamp },
        this.api_secret
      )
    };
  }

  getImageUrl(
    public_id: string,
    options: TransformationOptions | ConfigAndUrlOptions = {}
  ): string {
    return cloudinary.v2.url(public_id, options);
  }

  upload(path: string, options?: UploadApiOptions): Observable<UploadResponse> {
    return defer(() => cloudinary.v2.uploader.upload(path, options)).pipe(
      retry(2),
      catchError(() => of(null)),
      tap(() => fs.unlinkSync(path))
    );
  }

  handleUploaded(
    payload: Uploaded,
    options?: UploadApiOptions
  ): Observable<UploadResponse>;
  handleUploaded(
    payload: Uploaded[],
    options?: UploadApiOptions
  ): Observable<UploadResponse[]>;
  handleUploaded(
    payload: Uploaded | Uploaded[],
    options?: UploadApiOptions
  ): Observable<UploadResponse | UploadResponse[]> {
    return Array.isArray(payload)
      ? from(payload).pipe(
          concatMap(uploaded =>
            of<Observable<UploadResponse>>(this.upload(uploaded.path, options))
          ),
          zipAll()
        )
      : this.upload(payload.path, options);
  }

  remove(payload: RemovePayload | RemovePayload[]): Observable<unknown> {
    const source$ = from(Array.isArray(payload) ? payload : [payload]);
    return source$.pipe(
      mergeMap(payload => {
        const public_id =
          typeof payload === 'string'
            ? /res.cloudinary.com/.test(payload)
              ? (payload.match(/[^/\\&?]+(?=(.\w{3,4})$)/) || [])[0]
              : undefined
            : payload.public_id;

        return public_id ? cloudinary.v2.uploader.destroy(public_id) : empty();
      })
    );
  }
}
