import { from, defer, of, pipe, Observable } from 'rxjs';
import {
  filter,
  map,
  zipAll,
  mergeMap,
  retry,
  concatMap
} from 'rxjs/operators';
import {
  Param$CloudinaryUpload,
  Param$CloudinarySign,
  Schema$CloudinarySign,
  Response$CloudinaryUpload
} from '@/typings';
import { api } from './api';
import { createFormData } from './createFormData';
import { routes } from './routes';
import axios from 'axios';

// https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api

export const cloudinarySign = (payload?: Param$CloudinarySign) =>
  api.post<Schema$CloudinarySign>(routes.cloudinary_sign, payload);

export const cloudinaryUpload = ({
  api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  ...payload
}: Param$CloudinaryUpload) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not defined');
  }

  if (!api_key) {
    throw new Error('Cloudinary api key is not defined');
  }

  return axios.post<Response$CloudinaryUpload>(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    createFormData({ api_key, ...payload })
  );
};

type FileState = { file: File; url?: string };

type State = FileState | string | null;

export function handleCloudinaryUpload(
  payload: State,
  options?: Param$CloudinarySign
): Observable<string>;
export function handleCloudinaryUpload(
  payload: State[],
  options?: Param$CloudinarySign
): Observable<string[]>;
export function handleCloudinaryUpload(
  payload: State | State[],
  options?: Param$CloudinarySign
): Observable<string | string[]> {
  return defer(() => cloudinarySign(options)).pipe(
    retry(2),
    mergeMap(signPayload => {
      const handler = pipe(
        filter((i: State): i is FileState =>
          i && typeof i === 'object' ? true : false
        ),
        concatMap(({ file }) => {
          return defer(() =>
            cloudinaryUpload({ file, ...options, ...signPayload })
          ).pipe(map(res => res.data.secure_url));
        })
      );

      return Array.isArray(payload)
        ? from(payload).pipe(
            handler,
            map(item => of(item)),
            zipAll()
          )
        : of(payload).pipe(handler);
    })
  );
}
