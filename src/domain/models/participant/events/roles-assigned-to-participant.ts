import { EventBase, Id } from 'ddd-node';
import { Role } from '../../role';

export interface RolesAssignedToParticipantProps {
  assignorId: Id;
  targetId: Id;
  assignedRoles: Role[];
}

export class RolesAssignedToParticipant extends EventBase<RolesAssignedToParticipantProps> {}
