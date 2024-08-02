import { Id, Prop, StateAggregateBase } from 'ddd-node';
import { ChatJoinInvitationResponse } from './chat-join-invitation-response';
import {
  ChatJoinInvitationAccepted,
  ChatJoinInvitationDeclined,
  ChatJoinInvitationExpired,
} from './events';
import _ from 'lodash';

export interface ChatJoinInvitationProps {
  chatId: Id;
  chatType: string;
  inviterUserId: Id;
  invitedUserId: Id;
  expired: boolean;
  expiredAt?: Date;
  response?: ChatJoinInvitationResponse;
}

export class ChatJoinInvitation extends StateAggregateBase<ChatJoinInvitationProps> {
  @Prop()
  declare chatId: Id;

  @Prop()
  declare chatType: string;

  @Prop()
  declare inviterUserId: Id;

  @Prop()
  declare invitedUserId: Id;

  @Prop()
  declare expired: boolean;

  @Prop()
  declare expiredAt?: Date;

  @Prop()
  declare response?: ChatJoinInvitationResponse;

  hasResponse() {
    return Boolean(this.response);
  }

  isExpired() {
    return Date.now() > (this.expiredAt?.getTime() || Infinity);
  }

  isPending() {
    return !this.isExpired() && !this.hasResponse();
  }

  accept() {
    if (!this.isPending()) return;

    this._props.response = ChatJoinInvitationResponse.Accept;

    this.recordEvent(ChatJoinInvitationAccepted, {
      invitationId: this.id(),
      chatId: this.chatId,
      inviterUserId: this.inviterUserId,
      invitedUserId: this.invitedUserId,
    });
  }

  decline() {
    if (!this.isPending()) return;

    this._props.response = ChatJoinInvitationResponse.Decline;

    this.recordEvent(ChatJoinInvitationDeclined, {
      invitationId: this.id(),
      chatId: this.chatId,
      inviterUserId: this.inviterUserId,
      invitedUserId: this.invitedUserId,
    });
  }

  checkExpiration() {
    if (!this.hasResponse() && this.isExpired()) {
      if (!_.isNil(this.expired)) return;

      this._props.expired = true;

      this.recordEvent(ChatJoinInvitationExpired, {
        invitationId: this.id(),
        chatId: this.chatId,
        inviterUserId: this.inviterUserId,
        invitedUserId: this.invitedUserId,
      });
    }
  }
}
