import { EventBase, Id } from 'ddd-node';
import { Role } from '../../role';

export interface RolesRevokedFromParticipantProps {
  revokerId: Id;
  targetId: Id;
  revokedRoles: Role[];
}

export class RolesRevokedFromParticipant extends EventBase<RolesRevokedFromParticipantProps> {}
