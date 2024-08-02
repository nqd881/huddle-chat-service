import { Module } from '@nestjs/common';
import { CHAT_REPO } from './token';
import { InMemoryChatRepo } from './in-memory-chat-repo';

@Module({
  providers: [{ provide: CHAT_REPO, useClass: InMemoryChatRepo }],
  exports: [CHAT_REPO],
})
export class ChatRepoModule {}
