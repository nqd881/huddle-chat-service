import {
  ChatJoinInvitationEvent,
  ChatJoinInvitationEventProps,
} from './chat-join-invitation-event';

export interface ChatJoinInvitationExpiredProps
  extends ChatJoinInvitationEventProps {}

export class ChatJoinInvitationExpired extends ChatJoinInvitationEvent<ChatJoinInvitationExpiredProps> {}
