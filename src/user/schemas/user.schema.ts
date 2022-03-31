
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { GroupTypes } from 'src/group/types';
import { UserTypes } from '../types';

@Schema({versionKey: false})
export class User implements UserTypes.Schema {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  friends: UserTypes.UserShare[] = [];

  @Prop()
  groups: GroupTypes.GroupShare[] = [];
}

export type UserDocument = User & Document;
export type UserModel = Model<UserDocument>;
export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaImport = {
  name: User.name,
  schema: UserSchema,
};