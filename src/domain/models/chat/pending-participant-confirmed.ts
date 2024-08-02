import { EventBase, Id } from 'ddd-node';

export interface PendingParticipantConfirmedProps {
  chatId: Id;
  userId: Id;
}

export class PendingParticipantConfirmed extends EventBase<PendingParticipantConfirmedProps> {}
