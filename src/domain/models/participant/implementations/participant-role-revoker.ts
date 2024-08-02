import { Id } from 'ddd-node';
import { Participant } from '../participant';
import { Role } from '../../role';
import { RevokeRolePermission } from '../../permission';
import { ParticipantRoleRevocation } from '../participant-role-revocation';

export class ParticipantRoleRevoker extends Participant {
  initiateRoleRevocation(participantId: Id, roles: Role[]) {
    const canRevokeRole = this.isEligibleForPermission(RevokeRolePermission);

    if (!canRevokeRole) throw new Error();

    const revokedRoles = roles.filter((role) => this.hasRole(role));

    return new ParticipantRoleRevocation({
      chatId: this.chatId,
      revokerId: this.id(),
      targetId: participantId,
      revokedRoles,
    });
  }
}
