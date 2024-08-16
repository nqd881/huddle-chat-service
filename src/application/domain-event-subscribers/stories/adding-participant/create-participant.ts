import { IRepoRegistry } from 'application/abstractions';
import { RepoRegistryIdentifier } from 'application/app.identifiers';
import { EventSubscriber, SubscribeToEvents } from 'ddd-node';
import { PendingParticipantAdded } from 'domain/models/chat/events/pending-participant-added';
import { inject, injectable } from 'inversify';

@injectable()
@SubscribeToEvents(PendingParticipantAdded)
export class CreateParticipant extends EventSubscriber<PendingParticipantAdded> {
  constructor(
    @inject(RepoRegistryIdentifier) protected repoRegistry: IRepoRegistry,
  ) {
    super();
  }

  async handleEvent(event: PendingParticipantAdded): Promise<void> {
    const { chatId, userId } = event.props();

    const chat = await this.repoRegistry.chatRepo().chatOfId(chatId);

    if (!chat) throw new Error('Chat not found');

    const participant = chat.newParticipant(userId);

    await this.repoRegistry.participantRepo().save(participant);
  }
}
