import { ChatCreated } from 'domain/models/chat/events';
import { OnEvent, Process } from '../process';
import { ProcessType } from '../process/decorators/process-type';
import { ParticipantCreated } from 'domain/models/participant/events';

export interface InitiateChatProcessInput {
  initiatorId: string;
  inviteeUserIds: string[];
  title?: string;
  description?: string;
}

export interface InitiateChatProcessState {
  chatId?: string;
  initiatorParticipantId?: string;
}

@ProcessType('initiate_chat')
export class InitiateChatProcess extends Process<
  InitiateChatProcessInput,
  InitiateChatProcessState
> {
  checkCompleted(): boolean {
    return (
      this.state.chatId !== undefined &&
      this.state.initiatorParticipantId !== undefined
    );
  }

  @OnEvent(ChatCreated)
  async onChatCreated(event: ChatCreated) {
    const { chatId } = event.props();

    this.state.chatId = chatId;
  }

  @OnEvent(ParticipantCreated)
  async onParticipantCreated(event: ParticipantCreated) {
    const { participantId } = event.props();

    this.state.initiatorParticipantId = participantId;
  }
}
