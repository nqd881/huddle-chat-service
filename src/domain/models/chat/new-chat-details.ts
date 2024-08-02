import { Id, ValueObjectBase } from 'ddd-node';
import { ChatType } from './chat-type';
import { Role } from '../role';

export interface NewChatDetailsProps {
  creatorId: Id;
  title: string;
  description?: string;
  type: ChatType;
  participantLimit?: number;
  allowedRoles: Role[];
}

export class NewChatDetails extends ValueObjectBase<NewChatDetailsProps> {}
