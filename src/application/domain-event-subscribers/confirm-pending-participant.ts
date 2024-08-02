import { EventSubscriber, SubscribeToEvents } from 'ddd-node';
import { inject, injectable } from 'inversify';
import { ParticipantAdded } from 'domain/models/participant/events';
import { RepoRegistryToken } from '../app.token';
import { IRepoRegistry } from '../output-ports/repo-registry';

@injectable()
@SubscribeToEvents(ParticipantAdded)
export class ConfirmPendingParticipant extends EventSubscriber<ParticipantAdded> {
  constructor(@inject(RepoRegistryToken) private repoRegistry: IRepoRegistry) {
    super();
  }

  async handleEvent(event: ParticipantAdded): Promise<void> {
    const { chatId, userId } = event.props();

    const chat = await this.repoRegistry.chatRepo().chatOfId(chatId);

    if (!chat) throw new Error();

    chat.confirmPendingParticipant(userId);

    await this.repoRegistry.chatRepo().save(chat);
  }
}
