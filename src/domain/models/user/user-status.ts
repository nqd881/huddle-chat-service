import { Enum, EnumBase } from 'ddd-node';

export class UserStatus extends EnumBase {
  @Enum()
  static Active: UserStatus;

  @Enum()
  static Inactive: UserStatus;
}
