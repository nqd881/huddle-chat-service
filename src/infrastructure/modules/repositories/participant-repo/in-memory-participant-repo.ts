import { Participant } from 'domain/models/participant';
import { InMemoryRepo } from '../base/in-memory-repo';
import { IParticipantRepo } from 'domain/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryParticipantRepo
  extends InMemoryRepo<Participant>
  implements IParticipantRepo
{
  participantOfId(id: string): Promise<Participant | null> {
    return this.findById(id);
  }

  async participantOfChat(
    chatId: string,
    userId: string,
  ): Promise<Participant | null> {
    return (
      Array.from(this.records.values()).find(
        (participant) =>
          participant.chatId === chatId && participant.userId === userId,
      ) ?? null
    );
  }
}
