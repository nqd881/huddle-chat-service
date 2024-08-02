import { Chat } from 'domain/models/chat';
import { InMemoryRepo } from '../base/in-memory-repo';
import { IChatRepo } from 'domain/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryChatRepo extends InMemoryRepo<Chat> implements IChatRepo {
  chatOfId(id: string): Promise<Chat | null> {
    return this.findById(id);
  }
}
