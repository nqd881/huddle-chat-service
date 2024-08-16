import { InviteUserPermission } from '../permission';
import { Role } from './role';

export const PrivateChatMemberRole = new Role({
  name: 'PRIVATE_CHAT_MEMBER_ROLE',
  roles: [],
  permissions: [InviteUserPermission],
});
