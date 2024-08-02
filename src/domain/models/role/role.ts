import { Prop, ValueObjectBase } from 'ddd-node';
import { Permission } from '../permission';

export interface RoleProps {
  name: string;
  description?: string;
  roles: Role[];
  permissions: Permission[];
}

export class Role extends ValueObjectBase<RoleProps> {
  @Prop()
  declare name: string;

  @Prop()
  declare description?: string;

  @Prop()
  declare roles: Role[];

  @Prop()
  declare permissions: Permission[];

  hasSubRole(role: Role) {
    return this.roles.some((subRole) => subRole.hasRoleMatching(role));
  }

  hasRoleMatching(role: Role) {
    return this.equals(role) || this.hasSubRole(role);
  }

  hasDirectPermission(permission: Permission) {
    return this.permissions.some((directPermission) =>
      directPermission.equals(permission),
    );
  }

  hasPermission(permission: Permission) {
    return (
      this.hasDirectPermission(permission) ||
      this.roles.some((role) => role.hasPermission(permission))
    );
  }
}
