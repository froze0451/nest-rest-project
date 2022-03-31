
import { Exclude, Expose } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { GroupTypes } from "src/group/types";

export namespace UserTypes {

  export interface Schema {
    name: string,
    age: number,
    friends: UserShare[],
    groups: GroupTypes.GroupShare[]
  }

  @Exclude()
  export class UserShare { // для связи user-friends, group-followers
    @Expose()
    id: string // _id ObjectId string

    @Expose()
    name: string

    @Expose()
    age: number
  }

  

  export class BaseRequest {
    @Expose()
    @IsNotEmpty()
    @IsMongoId()
    userId: string
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
      @IsNotEmpty()
      @IsNumber()
      age: number
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
      @IsNotEmpty()
      @IsNumber()
      age: number
    }
  }
  
  export namespace friend {
    export namespace add {
      @Exclude()
      export class RequestDto extends BaseRequest {
        @Expose()
        @IsNotEmpty()
        @IsMongoId()
        friendId: string
      } 
    }
  }

  export namespace remove {
    @Exclude()
    export class RequestDto extends BaseRequest {}
  }
}