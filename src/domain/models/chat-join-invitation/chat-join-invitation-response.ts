import { Enum, EnumBase } from 'ddd-node';

export class ChatJoinInvitationResponse extends EnumBase {
  @Enum()
  static Accept: ChatJoinInvitationResponse;

  @Enum()
  static Decline: ChatJoinInvitationResponse;
}
