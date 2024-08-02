import { IRepository, Id } from 'ddd-node';
import { Chat } from '../models/chat';

export interface IChatRepo extends IRepository<Chat> {
  chatOfId(id: Id): Promise<Chat | null>;
}
