import { WorkflowBase, WorkflowBuilder } from 'wfes';
import { CreateInitiatorParticipant } from './steps/create-initiator-participant';
import { CreatePrivateChat } from './steps/create-private-chat';
import { InviteUser } from './steps/invite-user';
import { LogResult } from './steps/log-result';
import { ChatCreated } from 'domain/models/chat/events';
import { ParticipantActivated } from 'domain/models/participant/events/participant-activated';
import { InvitationCreated } from 'domain/models/invitation';

export interface InitiatePrivateChatData {
  workflowId?: string;
  userId: string;
  invitedUserId: string;
  chatId?: string;
  participantId?: string;
  invitationId?: string;
}

export class InitiatePrivateChatWorkflow extends WorkflowBase<InitiatePrivateChatData> {
  public readonly id = 'initiate-private-chat';
  public readonly version = 1;

  build(builder: WorkflowBuilder<InitiatePrivateChatData>) {
    builder
      .startWith(CreatePrivateChat)
      .input((step, data) => {
        step.input = {
          userId: data.userId,
        };
      })
      .output((step, data) => {
        data.workflowId = step.output?.workflowId;
        data.chatId = step.output?.chatId;
      })
      .waitFor(ChatCreated.eventType(), (data) => data.workflowId!)
      .then(CreateInitiatorParticipant)
      .input((step, data) => {
        step.input = {
          userId: data.userId,
          chatId: data.chatId!,
        };
      })
      .waitFor(ParticipantActivated.eventType(), (data) => data.workflowId!)
      .then(InviteUser)
      .input((step, data) => {
        step.input = {
          chatId: data.chatId!,
          inviterUserId: data.userId,
          invitedUserId: data.invitedUserId,
        };
      })
      .output((step, data) => {
        data.invitationId = step.output?.invitationId;
      })
      .waitFor(InvitationCreated.eventType(), (data) => data.workflowId!)
      .then(LogResult)
      .input((step, data) => {
        step.result = {
          workflowId: data.workflowId!,
          chatId: data.chatId!,
          participantId: data.participantId!,
          invitationId: data.invitationId!,
        };
      });
  }
}
