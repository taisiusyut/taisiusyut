import { IsPassword } from '@/decorators';

export class DeleteAccountDto {
  @IsPassword()
  password: string;
}
