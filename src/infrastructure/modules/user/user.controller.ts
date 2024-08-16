import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { NewPrivateChatCommand } from 'application/use-cases/user/new-private-chat';
import { NewUserCommand } from 'application/use-cases/user/new-user';
import { APP_CORE } from '../app-core/token';
import { App } from 'application/app';

@Controller('users')
export class UserController {
  constructor(@Inject(APP_CORE) private appCore: App) {}

  @Post('')
  async newUser() {
    const command = new NewUserCommand({});

    await this.appCore.handleCommand(command);
  }

  @Get('')
  async getUsers() {
    console.log(this.appCore.repoRegistry().userRepo());
  }

  @Get(':user_id')
  async getUser(@Param('user_id') userId: string) {
    const user = await this.appCore.repoRegistry().userRepo().userOfId(userId);

    console.log(user);
  }

  @Post(':user_id/chats/private')
  async newPrivateChat(
    @Param('user_id') userId: string,
    @Body()
    body: {
      targetUserId: string;
    },
  ) {
    const { targetUserId } = body;

    const command = new NewPrivateChatCommand(
      {
        targetUserId,
      },
      { userId },
    );

    await this.appCore.handleCommand(command);
  }
}
