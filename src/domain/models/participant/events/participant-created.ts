import { Event, EventBase, Id } from 'ddd-node';

export interface ParticipantCreatedProps {
  chatId: Id;
  userId: Id;
  participantId: Id;
}

@Event('PARTICIPANT_CREATED')
export class ParticipantCreated extends EventBase<ParticipantCreatedProps> {}
