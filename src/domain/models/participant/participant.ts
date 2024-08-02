import {
  Id,
  Model,
  Prop,
  StateAggregateBase,
  StateAggregateBuilder,
} from 'ddd-node';
import { Permission } from '../permission';
import { Restriction } from '../restriction';
import { Role } from '../role';
import {
  ParticipantAdded,
  ParticipantCreated,
  ParticipantNicknameChanged,
  RolesAssignedToParticipant,
  RolesRevokedFromParticipant,
} from './events';
import { Nickname } from './nickname';
import { ParticipantAddition } from './participant-addition';
import { ParticipantNicknameChange } from './participant-nickname-change';
import { ParticipantRoleAssignment } from './participant-role-assignment';
import { ParticipantRoleRevocation } from './participant-role-revocation';
import { ParticipantStatus } from './participant-status';
import { ParticipantActivated } from './events/participant-activated';

export interface ParticipantProps {
  chatId: Id;
  userId: Id;
  nickname?: Nickname;
  roles: Role[];
  status: ParticipantStatus;
}

@Model()
export class Participant extends StateAggregateBase<ParticipantProps> {
  static create(props: Omit<ParticipantProps, 'nickname' | 'status'>) {
    const participant = new ParticipantBuilder(this)
      .withProps({ ...props, status: ParticipantStatus.Pending })
      .build();

    participant.recordEvent(ParticipantCreated, {
      chatId: participant.chatId,
      userId: participant.userId,
      participantId: participant.id(),
    });

    return participant;
  }

  // static fromAddition(addition: ParticipantAddition) {
  //   const participant = new ParticipantBuilder(this)
  //     .withProps({
  //       chatId: addition.chatId,
  //       userId: addition.userId,
  //       roles: addition.roles,
  //     })
  //     .build();

  //   participant.recordEvent(ParticipantAdded, {
  //     chatId: participant.chatId,
  //     userId: participant.userId,
  //   });

  //   return participant;
  // }

  @Prop()
  declare chatId: Id;

  @Prop()
  declare userId: Id;

  @Prop()
  declare nickname?: Nickname;

  @Prop()
  declare roles: Role[];

  @Prop()
  declare restriction?: Restriction;

  @Prop()
  declare status: ParticipantStatus;

  activate() {
    if (this.status.isActive()) return;

    this._props.status = ParticipantStatus.Active;

    this.recordEvent(ParticipantActivated, {});
  }

  hasRole(role: Role) {
    return this.roles.some((_role) => _role.hasRoleMatching(role));
  }

  hasPermission(permission: Permission) {
    return this.roles.some((_role) => _role.hasPermission(permission));
  }

  isEligibleForRole(role: Role) {
    return this.hasRole(role) && !this.restriction?.isRoleRestricted(role);
  }

  isEligibleForPermission(permission: Permission) {
    return (
      this.hasPermission(permission) &&
      !this.restriction?.isPermissionRestricted(permission)
    );
  }

  changeNickname(nicknameChange: ParticipantNicknameChange) {
    const { initiatorId, targetId, nickname } = nicknameChange;

    if (this.id() !== targetId)
      throw new Error('Invalid ParticipantNicknameChange target');

    if (this.nickname?.equals(nickname)) return;

    this._props.nickname = nickname;

    this.recordEvent(ParticipantNicknameChanged, {
      initiatorId,
      targetId,
      nickname,
    });
  }

  assignRoles(roleAssignment: ParticipantRoleAssignment) {
    const { assignorId, targetId, assignedRoles } = roleAssignment;

    if (this.id() !== targetId)
      throw new Error('Invalid ParticipantRoleAssignment target');

    this._props.roles.push(...assignedRoles);

    this.recordEvent(RolesAssignedToParticipant, {
      assignorId,
      targetId,
      assignedRoles,
    });
  }

  revokeRoles(roleRevocation: ParticipantRoleRevocation) {
    const { revokerId, targetId, revokedRoles } = roleRevocation;

    if (this.id() !== targetId)
      throw new Error('Invalid ParticipantRoleRevocation target');

    this._props.roles = this._props.roles.filter((role) =>
      revokedRoles.some((revokedRole) => revokedRole.equals(role)),
    );

    this.recordEvent(RolesRevokedFromParticipant, {
      revokerId,
      targetId,
      revokedRoles,
    });
  }
}

export class ParticipantBuilder<
  T extends Participant,
> extends StateAggregateBuilder<T> {}
