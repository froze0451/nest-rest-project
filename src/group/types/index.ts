import { Exclude, Expose } from 'class-transformer';
import { IsIn, IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {UserTypes} from '../../user/types/index'

export namespace GroupTypes {
  export type GroupType = 'gaming' | 'sport' | 'work';
  export const GroupTypeValues = ['gaming', 'sport', 'work'] as const;

  export interface Schema {
    name: string,
    description: string,
    type: GroupType,
    followers: UserTypes.UserShare[],
  }

  @Exclude()
  export class GroupShare { // модель для связи group-followers(users)
    @Expose()
    id: string // _id ObjectId string

    @Expose()
    name: string

    @Expose()
    description: string

    @Expose()
    type: GroupType
  }

  export class BaseRequest {
    @Expose()
    @IsNotEmpty()
    @IsMongoId()
    userId: string

    @Expose()
    @IsNotEmpty()
    @IsMongoId()
    groupId: string
  }

  export namespace create {
    @Exclude()
    export class RequestDto {
      @Expose()
      @IsNotEmpty()
      @IsString()
      @MaxLength(100)
      name: string

      @Expose()
      @IsString()
      @MaxLength(1000)
      description: string

      @Expose()
      @IsNotEmpty()
      @IsIn(GroupTypeValues)
      type: GroupType
    }
  }

  export namespace get {
    @Exclude()
    export class RequestDto extends BaseRequest {}
  }

  export namespace edit {
    @Exclude()
    export class RequestDto extends BaseRequest {
      @Expose()
      @IsNotEmpty()
      @IsString()
      @MaxLength(100)
      name: string

      @Expose()
      @IsString()
      @MaxLength(1000)
      description: string

      @Expose()
      @IsNotEmpty()
      @IsIn(GroupTypeValues)
      type: GroupType
    }
  }

  export namespace follow {
    @Exclude()
    export class RequestDto extends BaseRequest {}
  }

  export namespace remove {
    @Exclude()
    export class RequestDto extends BaseRequest {}
  }
}


