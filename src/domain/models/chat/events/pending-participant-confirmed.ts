import { Event, EventBase, Id } from 'ddd-node';

export interface PendingParticipantConfirmedProps {
  chatId: Id;
  userId: Id;
}

@Event('PENDING_PARTICIPANT_CONFIRMED')
export class PendingParticipantConfirmed extends EventBase<PendingParticipantConfirmedProps> {}
