import { Id, Prop, StateAggregateBase } from 'ddd-node';
import { ChatType } from '../chat/chat-type';

export interface ChatInitiationProps {
  type: ChatType;
  initiatorUserId: Id;
  inviteeUserIds: Id[];
}

export class ChatInitiation extends StateAggregateBase<ChatInitiationProps> {
  @Prop()
  declare type: ChatType;

  @Prop()
  declare initiatorId: Id;

  @Prop()
  declare inviteeIds: Id[];
}
