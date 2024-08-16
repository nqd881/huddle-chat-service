import {
  Enum,
  EnumBase,
  Id,
  Prop,
  StateAggregateBase,
  StateAggregateBuilder,
} from 'ddd-node';
import {
  InvitationAccepted,
  InvitationCancelled,
  InvitationCreated,
  InvitationDeclined,
  InvitationExpired,
} from './events';

export class InvitationStatus extends EnumBase {
  @Enum('pending')
  static Pending: InvitationStatus;

  @Enum('accepted')
  static Accepted: InvitationStatus;

  @Enum('declined')
  static Declined: InvitationStatus;

  @Enum('expired')
  static Expired: InvitationStatus;

  @Enum('cancelled')
  static Cancelled: InvitationStatus;

  isPending() {
    return this === InvitationStatus.Pending;
  }

  isAccepted() {
    return this === InvitationStatus.Accepted;
  }

  isDeclined() {
    return this === InvitationStatus.Declined;
  }

  isExpired() {
    return this === InvitationStatus.Expired;
  }

  isCancelled() {
    return this === InvitationStatus.Cancelled;
  }
}

export interface InvitationProps {
  chatId: Id;
  inviterUserId: Id;
  invitedUserId: Id;
  expiredAt?: Date;
  status: InvitationStatus;
}

export class Invitation extends StateAggregateBase<InvitationProps> {
  static create(props: Omit<InvitationProps, 'status'>) {
    const invitation = new StateAggregateBuilder(Invitation)
      .withProps({ ...props, status: InvitationStatus.Pending })
      .build();

    invitation.recordEvent(InvitationCreated, {
      invitationId: invitation.id(),
      chatId: invitation.chatId,
      inviterUserId: invitation.inviterUserId,
      invitedUserId: invitation.invitedUserId,
    });

    return invitation;
  }

  @Prop()
  declare chatId: Id;

  @Prop()
  declare inviterUserId: Id;

  @Prop()
  declare invitedUserId: Id;

  @Prop()
  declare expiredAt?: Date;

  @Prop()
  declare status: InvitationStatus;

  toExpired() {
    if (!this.status.isPending()) return;

    if (!this.isExpired()) return;

    this.status = InvitationStatus.Expired;

    this.recordEvent(InvitationExpired, {
      invitationId: this.id(),
      chatId: this.chatId,
      inviterUserId: this.inviterUserId,
      invitedUserId: this.invitedUserId,
    });
  }

  accept() {
    if (!this.status.isPending()) return;

    this.toExpired();

    this.status = InvitationStatus.Accepted;

    this.recordEvent(InvitationAccepted, {
      invitationId: this.id(),
      chatId: this.chatId,
      inviterUserId: this.inviterUserId,
      invitedUserId: this.invitedUserId,
    });
  }

  decline() {
    if (!this.status.isPending()) return;

    this.toExpired();

    this.status = InvitationStatus.Declined;

    this.recordEvent(InvitationDeclined, {
      invitationId: this.id(),
      chatId: this.chatId,
      inviterUserId: this.inviterUserId,
      invitedUserId: this.invitedUserId,
    });
  }

  cancel() {
    if (!this.status.isPending()) return;

    if (this.isExpired()) {
      this.toExpired();
      return;
    }

    this.status = InvitationStatus.Cancelled;

    this.recordEvent(InvitationCancelled, {
      invitationId: this.id(),
      chatId: this.chatId,
      inviterUserId: this.inviterUserId,
      invitedUserId: this.invitedUserId,
    });
  }

  isExpired() {
    if (!this.expiredAt) return false;

    return Date.now() > this.expiredAt.getTime();
  }
}
