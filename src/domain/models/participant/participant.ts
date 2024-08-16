import {
  Id,
  Model,
  Prop,
  StateAggregateBase,
  StateAggregateBuilder,
} from 'ddd-node';
import { Invitation } from '../invitation';
import {
  AssignRolePermission,
  ChangeNicknamePermission,
  InviteUserPermission,
  Permission,
  RevokeRolePermission,
} from '../permission';
import { Restriction } from '../restriction';
import { Role } from '../role';
import {
  ParticipantCreated,
  ParticipantNicknameChanged,
  RolesAssignedToParticipant,
  RolesRevokedFromParticipant,
} from './events';
import { ParticipantActivated } from './events/participant-activated';
import { Nickname } from './nickname';
import { ParticipantNicknameChange } from './participant-nickname-change';
import { ParticipantRoleAssignment } from './participant-role-assignment';
import { ParticipantRoleRevocation } from './participant-role-revocation';
import { ParticipantStatus } from './participant-status';

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

    this.recordEvent(ParticipantActivated, {
      chatId: this.chatId,
      userId: this.userId,
      participantId: this.id(),
    });
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

  changeNickname(participantId: Id, nickname: Nickname) {
    const canChangeNickname = this.isEligibleForPermission(
      ChangeNicknamePermission,
    );

    if (!canChangeNickname)
      throw new Error('Cannot change nickname of participant');

    return new ParticipantNicknameChange({
      chatId: this.chatId,
      initiatorId: this.id(),
      targetId: participantId,
      nickname,
    });
  }

  applyNicknameChange(nicknameChange: ParticipantNicknameChange) {
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

  changeSelfNickname(nickname: Nickname) {
    const nicknameChange = this.changeNickname(this.id(), nickname);

    this.applyNicknameChange(nicknameChange);
  }

  assignRoles(participantId: Id, roles: Role[]) {
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

  applyRoleAssignment(roleAssignment: ParticipantRoleAssignment) {
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

  revokeRoles(participantId: Id, roles: Role[]) {
    const canRevokeRole = this.isEligibleForPermission(RevokeRolePermission);

    if (!canRevokeRole) throw new Error();

    const revokedRoles = roles.filter((role) => this.hasRole(role));

    return new ParticipantRoleRevocation({
      chatId: this.chatId,
      revokerId: this.id(),
      targetId: participantId,
      revokedRoles: revokedRoles,
    });
  }

  applyRoleRevocation(roleRevocation: ParticipantRoleRevocation) {
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

  inviteUser(invitedUserId: Id) {
    const canInviteUser = this.isEligibleForPermission(InviteUserPermission);

    if (!canInviteUser) throw new Error('This participant cannot invite user');

    const invitation = Invitation.create({
      chatId: this.chatId,
      inviterUserId: this.id(),
      invitedUserId,
    });

    return invitation;
  }
}

export class ParticipantBuilder<
  T extends Participant,
> extends StateAggregateBuilder<T> {}
