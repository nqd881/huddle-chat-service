import { Model, Prop, ValueObjectBase } from 'ddd-node';
import { Role } from '../role';
import { Permission } from '../permission';

export interface RestrictionProps {
  restrictedRoles: Role[];
  restrictedPermissions: Permission[];
  restrictedUntil?: Date;
  reason?: string;
}

@Model()
export class Restriction extends ValueObjectBase<RestrictionProps> {
  @Prop()
  declare restrictedRoles: Role[];

  @Prop()
  declare restrictedPermissions: Permission[];

  @Prop()
  declare restrictedUntil?: Date;

  @Prop()
  declare reason?: string;

  isActive() {
    if (!this.restrictedUntil) return true;

    return Date.now() < this.restrictedUntil.getTime();
  }

  isRoleRestricted(role: Role) {
    if (!this.isActive()) return false;

    return this.restrictedRoles.some((restrictedRole) =>
      restrictedRole.hasRoleMatching(role),
    );
  }

  isPermissionRestricted(permission: Permission) {
    if (!this.isActive()) return false;

    const isRestrictedDirectly = this.restrictedPermissions.some(
      (restrictedPermission) => restrictedPermission.equals(permission),
    );

    const isRestrictedIndirectly = this.restrictedRoles.some((restrictedRole) =>
      restrictedRole.hasPermission(permission),
    );

    return isRestrictedDirectly || isRestrictedIndirectly;
  }
}
