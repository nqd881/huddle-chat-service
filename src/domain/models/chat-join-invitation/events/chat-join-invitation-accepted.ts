import {
  ChatJoinInvitationEvent,
  ChatJoinInvitationEventProps,
} from './chat-join-invitation-event';

export class ChatJoinInvitationAcceptedProps extends ChatJoinInvitationEventProps {}

export class ChatJoinInvitationAccepted extends ChatJoinInvitationEvent<ChatJoinInvitationAcceptedProps> {}
