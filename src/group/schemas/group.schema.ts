
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { UserTypes } from 'src/user/types';
import { GroupTypes } from '../types';

@Schema({versionKey: false})
export class Group implements GroupTypes.Schema {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  type: GroupTypes.GroupType;

  @Prop()
  followers: UserTypes.UserShare[] = [];
}

export type GroupDocument = Group & Document;
export type GroupModel = Model<GroupDocument>;
export const GroupSchema = SchemaFactory.createForClass(Group);

export const GroupSchemaImport = {
  name: Group.name,
  schema: GroupSchema,
};