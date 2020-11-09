import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose';
import { PaginateModel, Document } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService extends MongooseCRUDService<User> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    @InjectModel(User.name)
    userModel: PaginateModel<User & Document>
  ) {
    super(userModel);
  }
}
