import { EventSubscriber, SubscribeToEvents } from 'ddd-node';
import { inject, injectable } from 'inversify';
import { PendingParticipantConfirmed } from 'domain/models/chat/events';
import { RepoRegistryIdentifier } from 'application/app.identifiers';
import { IRepoRegistry } from 'application/abstractions';

@injectable()
@SubscribeToEvents(PendingParticipantConfirmed)
export class ActivateParticipant extends EventSubscriber<PendingParticipantConfirmed> {
  constructor(
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
  ) {
    super();
  }

  async handleEvent(event: PendingParticipantConfirmed): Promise<void> {
    const { chatId, userId } = event.props();

    const participant = await this.repoRegistry
      .participantRepo()
      .participantOfChat(chatId, userId);

    if (!participant) throw new Error('Participant not found');

    participant.activate();

    await this.repoRegistry.participantRepo().save(participant);
  }
}
