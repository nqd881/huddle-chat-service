import { Id, Prop, ValueObjectBase } from 'ddd-node';
import { Role } from '../role';

export interface ParticipantRoleAssignmentProps {
  chatId: Id;
  assignorId: Id;
  targetId: Id;
  assignedRoles: Role[];
}

export class ParticipantRoleAssignment extends ValueObjectBase<ParticipantRoleAssignmentProps> {
  @Prop()
  declare chatId: Id;

  @Prop()
  declare assignorId: Id;

  @Prop()
  declare targetId: Id;

  @Prop()
  declare assignedRoles: Role[];
}
