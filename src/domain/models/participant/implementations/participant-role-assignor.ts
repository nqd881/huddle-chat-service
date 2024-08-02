import { Id } from 'ddd-node';
import { Participant } from '../participant';
import { Role } from '../../role';
import { AssignRolePermission } from '../../permission';
import { ParticipantRoleAssignment } from '../participant-role-assignment';

export class ParticipantRoleAssignor extends Participant {
  initiateRoleAssignment(participantId: Id, roles: Role[]) {
    const canAssignRole = this.isEligibleForPermission(AssignRolePermission);

    if (!canAssignRole) throw new Error();

    const assignedRoles = roles.filter((role) => this.hasRole(role));

    return new ParticipantRoleAssignment({
      chatId: this.chatId,
      assignorId: this.id(),
      targetId: participantId,
      assignedRoles,
    });
  }
}
