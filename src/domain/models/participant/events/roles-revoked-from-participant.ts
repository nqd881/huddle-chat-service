import { Event, EventBase, Id } from 'ddd-node';
import { Role } from '../../role';

export interface RolesRevokedFromParticipantProps {
  revokerId: Id;
  targetId: Id;
  revokedRoles: Role[];
}

@Event('ROLES_REVOKED_TO_PARTICIPANT')
export class RolesRevokedFromParticipant extends EventBase<RolesRevokedFromParticipantProps> {}
