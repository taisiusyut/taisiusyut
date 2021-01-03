import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { MongooseCRUDService, Model } from '@/utils/mongoose';
import { JWTSignPayload, UserRole, UserStatus } from '@/typings';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto';

const roles = Object.values(UserRole);
const filterRole = (predicate: (role: UserRole) => boolean) =>
  roles.filter(predicate).map(role => ({ role }));

@Injectable()
export class UserService extends MongooseCRUDService<User> {
  roles = {
    // make sure root cannot access other root that status is `Deleted`
    [UserRole.Root]: filterRole(role => role !== UserRole.Root),

    // admin cannot access root or other admin
    [UserRole.Admin]: filterRole(
      role => ![UserRole.Root, UserRole.Admin].includes(role)
    )
  };

  constructor(
    @InjectModel(User.name)
    readonly userModel: Model<User>
  ) {
    super(userModel);
  }

  create(payload: CreateUserDto) {
    payload = { role: UserRole.Client, ...payload, status: UserStatus.Active };
    return super.create(payload);
  }

  getRoleBasedQuery(user?: JWTSignPayload, query: FilterQuery<User> = {}) {
    const id = query._id;

    if (typeof id !== 'string') {
      throw new Error(`id should be string`);
    }

    if (
      !user ||
      user.role === UserRole.Author ||
      user.role === UserRole.Client ||
      user.role === UserRole.Guest
    ) {
      query = { _id: user?.user_id };
      query.$nor = [
        { status: UserStatus.Blocked },
        { status: UserStatus.Deleted }
      ];
    } else {
      query.$or = this.roles[user.role]?.map(value =>
        id === user.user_id ? { _id: id } : { _id: id, ...value }
      );
    }

    return query;
  }
}
