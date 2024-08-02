import { EventSubscriber, SubscribeToEvents } from 'ddd-node';
import { inject, injectable } from 'inversify';
import { PendingParticipantConfirmed } from 'domain/models/chat/pending-participant-confirmed';
import { RepoRegistryToken } from '../app.token';
import { IRepoRegistry } from '../output-ports/repo-registry';

@injectable()
@SubscribeToEvents(PendingParticipantConfirmed)
export class ActivateParticipant extends EventSubscriber<PendingParticipantConfirmed> {
  constructor(@inject(RepoRegistryToken) private repoRegistry: IRepoRegistry) {
    super();
  }

  async handleEvent(event: PendingParticipantConfirmed): Promise<void> {
    const { chatId, userId } = event.props();

    const participant = await this.repoRegistry
      .participantRepo()
      .participantOfChat(chatId, userId);

    if (!participant) throw new Error();

    participant.activate();

    await this.repoRegistry.participantRepo().save(participant);
  }
}
