import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Schema, MongooseFuzzySearchingField } from 'mongoose';
import { fuzzySearch } from '@/utils/mongoose';
import { Schema$User, UserRole } from '@/typings';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { ClientSchema } from './schemas/client.schema';
import { AuthorSchema } from './schemas/author.schema';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        discriminators: [
          {
            name: UserRole.Client,
            schema: ClientSchema
          },
          {
            name: UserRole.Author,
            schema: AuthorSchema
          }
        ],
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
