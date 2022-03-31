import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendNotFoundException, UserNotFoundException } from 'src/exceptions';
import { GroupTypes } from 'src/group/types';
import { User, UserModel } from './schemas/user.schema';
import { UserTypes } from './types';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) 
    private userModel: UserModel,
    ) {}

  async getAll() {
    return await this.userModel.find()
  }

  async create(data: UserTypes.create.RequestDto) {
    return await this.userModel.create(data)
  }

  /**
   * проверяет существует ли пользователь
   * и возвращает его
   */
  async get(userId: string) {
    const user = await this.userModel.findById(userId)
    if (!user) throw new UserNotFoundException()

    return user;
  }

  async edit({userId, ...editData}: UserTypes.edit.RequestDto) {
    return await this.userModel.findByIdAndUpdate(userId,
      { ...editData },
      { new: true }
    )
  }

  /**
   * удалить подписку на группу
   * в моделе пользователя
   */
  async unfollowGroup(followers: string[], groupId: string) {
    await this.userModel.updateMany(
      { id: {$in: followers} }, 
      { $pull: {groups: {id: groupId}} },
    )
  }

  /**
   * удаляет пользователя
   * в моделях его друзей
   */
  async removeFriend(userId: string, friendsIds: string[]) {
    await this.userModel.updateMany(
      { id: {$in: friendsIds} }, 
      { $pull: {friends: {id: userId}} },
    )
  }

  /**
   * обновить общую информацию
   * о пользователей для его друзей
   */
  async updateFriendsInfo(friendsIds: string[], {userId, name, age}: UserTypes.edit.RequestDto) {
    await this.userModel.updateMany(
      { id: {$in: friendsIds}, "friends.id": userId}, 
      {
        $set: {
          "friends.$.name": name,
          "friends.$.age": age,
        }
      }
    )
  }

  /**
   * обновить общую информацию
   * группы для пользователей
   */
  async updateUsersGroupInfo(followers: string[], {groupId, name, type, description}: Omit<GroupTypes.edit.RequestDto, 'userId'>) {
    await this.userModel.updateMany(
      { id: {$in: followers}, "groups.id": groupId}, 
      { 
        $set: { 
          "groups.$.name": name,
          "groups.$.type": type,
          "groups.$.description": description,
        } 
      }
    )
  }

  async followGroup(userId: string, group: GroupTypes.GroupShare) {
    return await this.userModel.findByIdAndUpdate(userId,
      {
        $push: {groups: group}
      },
      {new: true}
    )
  }

  async addFriend(userId: string, friendId: string) {
    const friend = await this.userModel.findById(friendId)
    if (!friend) throw new FriendNotFoundException()

    const friendShare = plainToInstance(UserTypes.UserShare, friend)

    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: {friends: {...friendShare}}
      },
      {new: true}
    )
  }

  async remove(userId: string) {
    return await this.userModel.findByIdAndDelete(userId)
  }
}
