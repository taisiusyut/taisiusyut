import { ValidateIf, IsString, IsNotEmpty } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { Param$ModifyPassword } from '@/typings';
import { IsPassword } from '@/decorators';

export class ModifyPasswordDto implements Param$ModifyPassword {
  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateIf((o: ModifyPasswordDto) => {
    if (o.password === o.newPassword) {
      throw new BadRequestException(
        'The new password you entered is the same as your old password'
      );
    }
    return true;
  })
  @IsPassword()
  newPassword: string;

  @ValidateIf((o: ModifyPasswordDto) => {
    if (o.newPassword !== o.confirmNewPassword) {
      throw new BadRequestException(
        'Confirm password is not equal to the new password'
      );
    }
    return true;
  })
  @IsString()
  @IsPassword()
  confirmNewPassword: string;
}
