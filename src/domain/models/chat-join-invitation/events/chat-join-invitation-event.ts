import { EventBase, Id } from 'ddd-node';

export class ChatJoinInvitationEventProps {
  invitationId: Id;
  chatId: Id;
  inviterUserId: Id;
  invitedUserId: Id;
}

export class ChatJoinInvitationEvent<
  P extends ChatJoinInvitationEventProps,
> extends EventBase<P> {}
