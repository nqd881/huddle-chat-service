import { Id, Prop, ValueObjectBase } from 'ddd-node';
import { Role } from '../role';

export interface ParticipantRoleRevocationProps {
  chatId: Id;
  revokerId: Id;
  targetId: Id;
  revokedRoles: Role[];
}

export class ParticipantRoleRevocation extends ValueObjectBase<ParticipantRoleRevocationProps> {
  @Prop()
  declare chatId: Id;

  @Prop()
  declare revokerId: Id;

  @Prop()
  declare targetId: Id;

  @Prop()
  declare revokedRoles: Role[];
}
