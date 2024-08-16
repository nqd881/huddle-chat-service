import { IRepoRegistry } from 'application/abstractions';
import { RepoRegistryIdentifier } from 'application/app.identifiers';
import { EventSubscriber, SubscribeToEvents } from 'ddd-node';
import { ParticipantCreated } from 'domain/models/participant/events';
import { inject, injectable } from 'inversify';

@injectable()
@SubscribeToEvents(ParticipantCreated)
export class ConfirmPendingParticipant extends EventSubscriber<ParticipantCreated> {
  constructor(
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
  ) {
    super();
  }

  async handleEvent(event: ParticipantCreated): Promise<void> {
    const { chatId, userId } = event.props();

    const chat = await this.repoRegistry.chatRepo().chatOfId(chatId);

    if (!chat) throw new Error('Chat not found');

    chat.confirmPendingParticipant(userId);

    await this.repoRegistry.chatRepo().save(chat);
  }
}
