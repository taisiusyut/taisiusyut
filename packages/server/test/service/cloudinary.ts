import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import {
  Schema$CloudinarySign,
  Param$CloudinaryUpload,
  Response$CloudinaryUpload
} from '@/typings';
import { routes } from '@/constants';
import superagent from 'superagent';
import path from 'path';

const cloudinaryService = app.get(CloudinaryService);

export async function cloudinarySign(
  token: string
): Promise<Schema$CloudinarySign> {
  const response = await request
    .post(routes.cloudinary_sign)
    .set('Authorization', `bearer ${token}`)
    .send();

  if (response.error) {
    throw response.error;
  }

  return response.body;
}

export const defaultImageFile = path.resolve(__dirname, '../1x1.png');

export async function cloudinaryUpload({
  file,
  ...payload
}: Param$CloudinaryUpload): Promise<Response$CloudinaryUpload> {
  const [api_key, , cloud_name] = cloudinaryService.parseCloudinaryURL();

  if (!cloud_name) {
    throw new Error('Cloudinary cloud name is not defined');
  }

  if (!api_key) {
    throw new Error('Cloudinary api key is not defined');
  }

  const response = await superagent
    .post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`)
    .set('Content-Type', 'multipart/form-data')
    .field({ ...payload, api_key } as Record<string, string | number>)
    .attach('file', file);

  if (response.error) {
    throw response.error;
  }

  return response.body;
}
