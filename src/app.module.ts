import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserSchemaImport } from './user/schemas/user.schema';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { GroupSchemaImport } from './group/schemas/group.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MongooseModule.forFeature([UserSchemaImport, GroupSchemaImport]),
  ],
  controllers: [UserController, GroupController],
  providers: [UserService, GroupService],
})
export class AppModule {}
