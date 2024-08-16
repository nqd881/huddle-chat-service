import { Module } from '@nestjs/common';
import { EventStoreModule } from 'infrastructure/modules/event-store';
import { InMemoryChatRepo } from './in-memory-chat-repo';
import { CHAT_REPO } from './token';

@Module({
  imports: [EventStoreModule],
  providers: [{ provide: CHAT_REPO, useClass: InMemoryChatRepo }],
  exports: [CHAT_REPO],
})
export class ChatRepoModule {}
