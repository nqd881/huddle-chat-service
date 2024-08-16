import { Event, EventBase, Id, Prop } from 'ddd-node';

export interface ParticipantActivatedProps {
  chatId: Id;
  userId: Id;
  participantId: Id;
}

@Event('PARTICIPANT_ACTIVATED')
export class ParticipantActivated extends EventBase<ParticipantActivatedProps> {
  @Prop()
  declare chatId: Id;

  @Prop()
  declare userId: Id;

  @Prop()
  declare participantId: Id;
}
