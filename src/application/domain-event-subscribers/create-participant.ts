import { EventSubscriber, SubscribeToEvents } from 'ddd-node';
import { inject, injectable } from 'inversify';
import { PendingParticipantAdded } from 'domain/models/chat/events/pending-participant-added';
import { RepoRegistryToken } from '../app.token';
import { IRepoRegistry } from '../output-ports/repo-registry';

@injectable()
@SubscribeToEvents(PendingParticipantAdded)
export class CreateParticipant extends EventSubscriber<PendingParticipantAdded> {
  constructor(@inject(RepoRegistryToken) private repoRegistry: IRepoRegistry) {
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
