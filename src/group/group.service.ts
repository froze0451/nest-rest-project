import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { GroupNotFoundException } from 'src/exceptions';
import { UserTypes } from 'src/user/types';
import { UserService } from 'src/user/user.service';
import { Group, GroupModel } from './schemas/group.schema';
import { GroupTypes } from './types';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) 
    private groupModel: GroupModel,
    private readonly userService: UserService
  ) {}

 
  async create(data: GroupTypes.create.RequestDto) {
    return await this.groupModel.create(data)
  }

  async get(groupId: string) {
    const group = await this.groupModel.findById(groupId)
    if (!group) throw new GroupNotFoundException();
    return group;
  }

  async getAll() {
    return await this.groupModel.find()
  }

  async edit({groupId, ...editData}: Omit<GroupTypes.edit.RequestDto, 'userId'>) {
    const {followers} = await this.get(groupId)

    const followersIds = followers.map(follower => follower.id)
    await this.userService.updateUsersGroupInfo(followersIds, {groupId, ...editData})

    return await this.groupModel.findByIdAndUpdate(groupId, 
      {...editData},
      {new: true}
    )
  }

  async cancelFollow(userId: string, groupIds: string[]) {
    await this.groupModel.updateMany(
      { id: {$in: groupIds} }, 
      { $pull: {followers: {id: userId}} },
    )
  }

  async remove(groupId: string) {
    return await this.groupModel.findByIdAndDelete(groupId)
  }

  async addFollower(user: UserTypes.UserShare, groupId: string) {
    const group = await this.get(groupId)

    await this.groupModel.findByIdAndUpdate(groupId,
      {$push: {followers: user}},
    )

    return await this.userService.followGroup(user.id, plainToInstance(GroupTypes.GroupShare, group))
  }

  async editFollowersInfo(groupsIds: string[], {userId, name, age}: UserTypes.edit.RequestDto) {
    await this.groupModel.updateMany(
      { id: {$in: groupsIds}, "followers.id": userId}, 
      {
        $set: {
          "followers.$.name": name,
          "followers.$.age": age,
        }
      }
    )
  }
}
