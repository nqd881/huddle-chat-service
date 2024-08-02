import { EventBase, Id } from 'ddd-node';

export interface ParticipantAddedProps {
  chatId: Id;
  userId: Id;
}

export class ParticipantAdded extends EventBase<ParticipantAddedProps> {}
