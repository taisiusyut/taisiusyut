import { from, defer, of, pipe, Observable } from 'rxjs';
import { filter, map, zipAll, mergeMap, retry } from 'rxjs/operators';
import { RxFileToImageState } from 'use-rx-hooks';
import { routes } from '@/constants';
import {
  Param$CloudinaryUpload,
  Schema$CloudinarySign,
  Response$CloudinaryUpload
} from '@/typings';
import { api } from './api';
import { createFormData } from './createFormData';
import axios from 'axios';

// https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api

export const cloudinarySign = () =>
  api.post<Schema$CloudinarySign>(routes.cloudinary_sign);

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
    createFormData({ api_key, ...payload }),
    { useResponse: true } // for typings
  );
};

type State = RxFileToImageState | string | null;
export function handleCloudinaryUpload(payload: State): Observable<string>;
export function handleCloudinaryUpload(payload: State[]): Observable<string[]>;
export function handleCloudinaryUpload(
  payload: State | State[]
): Observable<string | string[]> {
  return defer(() => cloudinarySign()).pipe(
    retry(2),
    mergeMap(signPayload => {
      const handler = pipe(
        filter((i: State): i is RxFileToImageState =>
          i && typeof i === 'object' ? true : false
        ),
        mergeMap(({ file }) => {
          return defer(() => cloudinaryUpload({ file, ...signPayload })).pipe(
            map(res => res.data.secure_url)
          );
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
