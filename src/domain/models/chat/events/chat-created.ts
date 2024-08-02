import { Event, EventBase, Id } from 'ddd-node';
import { ChatType } from '../chat-type';

export interface ChatCreatedProps {
  creatorId: Id;
  chatId: Id;
  title: string;
  type: ChatType;
}

@Event('CHAT_CREATED')
export class ChatCreated extends EventBase<ChatCreatedProps> {}
