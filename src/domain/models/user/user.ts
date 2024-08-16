import { Prop, StateAggregateBase, StateAggregateBuilder } from 'ddd-node';
import { Chat, NewChatDetails } from '../chat';
import { UserStatus } from './user-status';
import { ChatType } from '../chat/chat-type';
import { UserCreated } from './events/user-created';
import { PrivateChatMemberRole } from '../role/default-roles';

export interface UserProps {
  status: UserStatus;
}

export class User extends StateAggregateBase<UserProps> {
  static create() {
    const user = new UserBuilder()
      .withProps({ status: UserStatus.Active })
      .build();

    user.recordEvent(UserCreated, {});

    return user;
  }

  @Prop()
  declare status: UserStatus;

  createPrivateChat() {
    const newChatDetails = new NewChatDetails({
      creatorId: this.id(),
      title: '',
      description: '',
      type: ChatType.Private,
      participantLimit: 2,
      allowedRoles: [PrivateChatMemberRole],
    });

    const privateChat = Chat.create(newChatDetails);

    return privateChat;
  }

  createGroupChat() {}

  createChannel() {}
}

export class UserBuilder extends StateAggregateBuilder<User> {
  constructor() {
    super(User);
  }
}
