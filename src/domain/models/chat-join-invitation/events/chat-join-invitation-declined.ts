import {
  ChatJoinInvitationEvent,
  ChatJoinInvitationEventProps,
} from './chat-join-invitation-event';

export interface ChatJoinInvitationDeclinedProps
  extends ChatJoinInvitationEventProps {}

export class ChatJoinInvitationDeclined extends ChatJoinInvitationEvent<ChatJoinInvitationDeclinedProps> {}
