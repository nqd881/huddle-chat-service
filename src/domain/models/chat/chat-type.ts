import { Enum, EnumBase } from 'ddd-node';

export class ChatType extends EnumBase {
  @Enum()
  static Private: ChatType;

  @Enum()
  static Group: ChatType;

  @Enum()
  static Channel: ChatType;
}
