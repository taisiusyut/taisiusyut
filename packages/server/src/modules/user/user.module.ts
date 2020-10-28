import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema, MongooseFuzzySearchingField } from 'mongoose';
import { fuzzySearch } from '@/utils/mongoose';
import { Schema$User } from '@/typings';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async () => {
          const schema = UserSchema as Schema<User>;

          const fields: MongooseFuzzySearchingField<Schema$User>[] = [
            { name: 'username' },
            { name: 'nickname' },
            { name: 'email', escapeSpecialCharacters: false }
          ];

          schema.plugin(fuzzySearch, { fields });

          schema.plugin(paginate);

          return schema;
        }
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
