import { Id, Prop, ValueObjectBase } from 'ddd-node';
import { Role } from '../role';

export interface ParticipantAdditionProps {
  chatId: Id;
  userId: Id;
  roles: Role[];
}

export class ParticipantAddition extends ValueObjectBase<ParticipantAdditionProps> {
  @Prop()
  declare chatId: Id;

  @Prop()
  declare userId: Id;

  @Prop()
  declare roles: Role[];
}
