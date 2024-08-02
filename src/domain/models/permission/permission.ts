import { Prop, ValueObjectBase } from 'ddd-node';

export interface PermissionProps {
  name: string;
  description?: string;
}

export class Permission extends ValueObjectBase<PermissionProps> {
  @Prop()
  declare name: string;

  @Prop()
  declare description?: string;
}
