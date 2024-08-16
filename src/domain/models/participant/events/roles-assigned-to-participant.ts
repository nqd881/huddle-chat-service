import { Event, EventBase, Id } from 'ddd-node';
import { Role } from '../../role';

export interface RolesAssignedToParticipantProps {
  assignorId: Id;
  targetId: Id;
  assignedRoles: Role[];
}

@Event('ROLES_ASSIGNED_TO_PARTICIPANT')
export class RolesAssignedToParticipant extends EventBase<RolesAssignedToParticipantProps> {}
