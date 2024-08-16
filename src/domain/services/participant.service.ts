import { Role } from 'domain/models/role';
import { Participant } from '../models/participant';
import { Nickname } from '../models/participant/nickname';

export class ParticipantService {
  static changeNickname(
    initiatorParticipant: Participant,
    targetParticipant: Participant,
    nickname: Nickname,
  ) {
    const nicknameChange = initiatorParticipant.changeNickname(
      targetParticipant.id(),
      nickname,
    );

    targetParticipant.applyNicknameChange(nicknameChange);
  }

  static assignRoles(
    assignor: Participant,
    targetParticipant: Participant,
    roles: Role[],
  ) {
    const roleAssignment = assignor.assignRoles(targetParticipant.id(), roles);

    targetParticipant.applyRoleAssignment(roleAssignment);
  }

  static revokeRoles(
    revoker: Participant,
    targetParticipant: Participant,
    roles: Role[],
  ) {
    const roleRevocation = revoker.revokeRoles(targetParticipant.id(), roles);

    targetParticipant.applyRoleRevocation(roleRevocation);
  }
}
