import { EntityBase, Prop, ValueObjectBase } from 'ddd-node';

export interface PermissionProps {
  name: string;
}

export class Permission extends ValueObjectBase<PermissionProps> {
  @Prop()
  declare name: string;
}

// export class Permission extends EntityBase<PermissionProps> {
//   @Prop()
//   declare name: string;

//   // @Prop()
//   // declare description?: string;
// }
