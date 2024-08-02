import { EventBase, Id } from 'ddd-node';

export interface PendingParticipantAddedProps {
  chatId: Id;
  userId: Id;
}

export class PendingParticipantAdded extends EventBase<PendingParticipantAddedProps> {}
