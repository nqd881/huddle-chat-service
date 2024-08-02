import { IRepository } from 'ddd-node';
import { ChatJoinInvitation } from '../models/chat-join-invitation';

export interface IChatJoinInvitationRepo
  extends IRepository<ChatJoinInvitation> {}
