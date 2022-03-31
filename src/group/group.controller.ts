import { Body, Controller, ForbiddenException, Get, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FollowedGroupException } from 'src/exceptions';
import { UserTypes } from 'src/user/types';
import { UserService } from 'src/user/user.service';
import { GroupService } from './group.service';
import { GroupTypes } from './types';

@Controller('/group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UserService,
    ) {}

  @Get('/getAll')
  async getAll() {
    return await this.groupService.getAll()
  }

  @Post('/create')
  async create(
    @Body() data: GroupTypes.create.RequestDto,
  ) {
    return await this.groupService.create(data)
  }

  @Post('/get')
  async get(
    @Body() {userId, groupId}: GroupTypes.get.RequestDto,
  ) {
    // запрос совершает существующий пользователь
    await this.userService.get(userId);
    return await this.groupService.get(groupId)
  }

  @Post('/edit')
  async edit(
    @Body() {userId, ...data}: GroupTypes.edit.RequestDto,
  ) {
    await this.userService.get(userId);
    return await this.groupService.edit(data)
  }

  @Post('/follow')
  async follow(
    @Body() {userId, groupId}: GroupTypes.follow.RequestDto,
  ) {
    const user = await this.userService.get(userId);
    
    const userGroupsIds = user.groups.map(group => group.id)
    if (userGroupsIds.includes(groupId)) throw new FollowedGroupException()

    return await this.groupService.addFollower(plainToInstance(UserTypes.UserShare, user), groupId)
  }

  @Post('/remove')
  async remove(
    @Body() {userId, groupId}: GroupTypes.remove.RequestDto,
  ) {
    const user = await this.userService.get(userId);

    const userGroupIds = user.groups.map(group => group.id)
    if (!userGroupIds.includes(groupId)) throw new ForbiddenException()

    const {id, followers} = await this.groupService.get(groupId)

    if (followers.length > 0) {
      const followersIds = followers.map(follower => follower.id)
      await this.userService.unfollowGroup(followersIds, groupId)
    }

    return await this.groupService.remove(id)
  }
}
