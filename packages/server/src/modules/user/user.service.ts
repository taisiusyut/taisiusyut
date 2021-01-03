import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose';
import { PaginateModel, Document, FilterQuery } from 'mongoose';
import { JWTSignPayload, UserRole, UserStatus } from '@/typings';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto';

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
  }

  create(payload: CreateUserDto) {
    payload = { status: UserStatus.Active, role: UserRole.Client, ...payload };
    return super.create(payload);
  }

  getRoleBasedQuery(user?: JWTSignPayload, query: FilterQuery<User> = {}) {
    const id = query._id;

    if (typeof id !== 'string') {
      throw new Error(`id expect string`);
    }

    if (
      !user ||
      user.role === UserRole.Author ||
      user.role === UserRole.Client ||
      user.role === UserRole.Guest
    ) {
      query = { _id: user?.user_id };
    } else {
      query.$or = this.roles[user.role]?.map(value =>
        id === user.user_id ? { _id: id } : { _id: id, ...value }
      );
    }

    return query;
  }
}
