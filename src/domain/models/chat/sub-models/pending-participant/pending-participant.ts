import { Id, Prop, ValueObjectBase } from 'ddd-node';
import { Role } from '../../../role';

export interface PendingParticipantProps {
  chatId: Id;
  userId: Id;
  roles: Role[];
  expiredAt: Date;
}

export class PendingParticipant extends ValueObjectBase<PendingParticipantProps> {
  @Prop()
  declare chatId: Id;

  @Prop()
  declare userId: Id;

  @Prop()
  declare roles: Role[];

  @Prop()
  declare expiredAt: Date;

  isExpired() {
    return Date.now() > this.expiredAt.getTime();
  }
}
