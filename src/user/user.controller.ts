import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExistingFriendException, SelfFriendRequestException } from 'src/exceptions';
import { GroupService } from 'src/group/group.service';
import { UserTypes } from './types';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor (
    private readonly userService: UserService,
    private readonly groupService: GroupService
  ) {}

  @Get('/getAll')
  async getAll() {
    return await this.userService.getAll()
  }

  @Post('/create')
  async create(
    @Body() data: UserTypes.create.RequestDto,
  ) {
    return await this.userService.create(data)
  }

  @Post('/get')
  async get(
    @Body() {userId}: UserTypes.get.RequestDto,
  ) {
    return await this.userService.get(userId);
  }

  @Post('/edit')
  async edit(
    @Body() data: UserTypes.edit.RequestDto,
  ) {
    const {groups, friends} = await this.userService.get(data.userId)

    if (friends.length > 0) {
      const friendsIds = friends.map(friend => friend.id)
      await this.userService.updateFriendsInfo(friendsIds, data)
    }

    if (groups.length > 0) {
      const groupsIds = groups.map(group => group.id)
      await this.groupService.editFollowersInfo(groupsIds, data)
    }

    return await this.userService.edit(data);
  }

  @Post('/remove')
  async remove(
    @Body() {userId}: UserTypes.remove.RequestDto,
  ) {
    const {id, friends, groups} = await this.userService.get(userId);

    if (friends.length > 0) {
      const userFriendsIds = friends.map(friend => friend.id)
      await this.userService.removeFriend(id, userFriendsIds)
    }

    if (groups.length > 0) {
      const groupsIds = groups.map(group => group.id)
      await this.groupService.cancelFollow(id, groupsIds)
    }

    return await this.userService.remove(id);
  }

  @Post('/add/friend')
  async addFriend(
    @Body() {userId, friendId}: UserTypes.friend.add.RequestDto,
  ) {
    if (userId === friendId) 
      throw new SelfFriendRequestException();

    const {friends, id} = await this.userService.get(userId);
    await this.userService.get(friendId);

    const userFriendsIds = friends.map(friend => friend.id)
    if (userFriendsIds.includes(friendId)) throw new ExistingFriendException()

    await this.userService.addFriend(friendId, id)
    return await this.userService.addFriend(id, friendId)
  }
}
