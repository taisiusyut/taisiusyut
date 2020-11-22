import { IsOptional, IsString } from 'class-validator';
import { Param$CloudinarySign } from '@/typings';

export class Excluded {}

export class CloudinarySignDto
  implements Partial<Omit<Param$CloudinarySign, keyof Excluded>> {
  @IsOptional()
  @IsString()
  public_id?: string;

  @IsOptional()
  @IsString()
  eager?: string;
}
