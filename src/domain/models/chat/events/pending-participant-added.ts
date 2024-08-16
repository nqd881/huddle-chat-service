import { Event, EventBase, Id } from 'ddd-node';

export interface PendingParticipantAddedProps {
  chatId: Id;
  userId: Id;
}

@Event('PENDING_PARTICIPANT_ADDED')
export class PendingParticipantAdded extends EventBase<PendingParticipantAddedProps> {}
