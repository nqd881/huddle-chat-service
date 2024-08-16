import { Permission } from './permission';

export const ChangeNicknamePermission = new Permission({
  name: 'CHANGE_NICKNAME',
});

export const AssignRolePermission = new Permission({
  name: 'ASSIGN_ROLE',
});

export const RevokeRolePermission = new Permission({
  name: 'REVOKE_ROLE',
});

export const InviteUserPermission = new Permission({
  name: 'INVITE_USER',
});
