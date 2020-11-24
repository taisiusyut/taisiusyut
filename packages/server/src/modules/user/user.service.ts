import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose';
import { PaginateModel, Document, FilterQuery } from 'mongoose';
import { User } from './schemas/user.schema';
import { JWTSignPayload, UserRole } from '@/typings';

const roles = Object.values(UserRole);

@Injectable()
export class UserService extends MongooseCRUDService<User> {
  roles = {
    [UserRole.Root]: roles.map(role => ({ role })),
    [UserRole.Admin]: roles
      .filter(role => ![UserRole.Root, UserRole.Admin].includes(role))
      .map(role => ({ role }))
  };

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    @InjectModel(User.name)
    userModel: PaginateModel<User & Document>
  ) {
    super(userModel);

    // userModel.deleteOne({ nickname: 'Guest' }).then(console.log);
  }

  getRoleBasedQuery(id?: string, user?: JWTSignPayload) {
    if (!user) {
      throw new InternalServerErrorException(`user is ${user}`);
    }

    let query: FilterQuery<User> = {};

    if (
      user.role === UserRole.Author ||
      user.role === UserRole.Client ||
      user.role === UserRole.Guest
    ) {
      if (user.user_id !== id) {
        throw new ForbiddenException();
      }
      query = { _id: user.user_id };
    } else {
      query.$or = this.roles[user.role]?.map(value =>
        id === user.user_id ? { _id: id } : { _id: id, ...value }
      );
    }

    return query;
  }
}
