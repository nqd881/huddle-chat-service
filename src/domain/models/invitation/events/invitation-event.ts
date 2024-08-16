import { EventBase, Id } from 'ddd-node';

export class InvitationEventProps {
  invitationId: Id;
  chatId: Id;
  inviterUserId: Id;
  invitedUserId: Id;
}

export class InvitationEvent<
  P extends InvitationEventProps,
> extends EventBase<P> {}
