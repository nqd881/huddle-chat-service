import { Permission } from './permission';

export const ChangeNicknamePermission = new Permission({
  name: 'CHANGE_NICKNAME',
  description: 'Change nickname of participant',
});

export const AssignRolePermission = new Permission({
  name: 'ASSIGN_ROLE',
  description: 'Assign role to participant'
})

export const RevokeRolePermission = new Permission({
  name: 'REVOKE_ROLE',
  description: 'Revoke role from participant',
});

