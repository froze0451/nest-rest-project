import { HttpException } from "@nestjs/common"

export class UserNotFoundException extends HttpException {
  constructor() { 
    super('user not found', 500) 
  }
}

export class FriendNotFoundException extends HttpException {
  constructor() { 
    super("friend not found", 500) 
  }
}

export class GroupNotFoundException extends HttpException {
  constructor() { 
    super('group not found', 500) 
  }
}

export class FollowedGroupException extends HttpException {
  constructor() { 
    super("user's already followed the group", 500) 
  }
}

export class UserGroupAccessException extends HttpException {
  constructor() { 
    super("user doesnt follow the group", 500) 
  }
}

export class ExistingFriendException extends HttpException {
  constructor() { 
    super("friend is already exists", 500) 
  }
}

export class SelfFriendRequestException extends HttpException {
  constructor() { 
    super("can't add yourself to a friend list", 500) 
  }
}
