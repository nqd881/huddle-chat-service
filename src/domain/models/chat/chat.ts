import { Id, Prop, StateAggregateBase, StateAggregateBuilder } from 'ddd-node';
import { isNil } from 'lodash';
import { Participant } from '../participant';
import { Role } from '../role';
import { ChatType } from './chat-type';
import {
  ChatCreated,
  PendingParticipantAdded,
  PendingParticipantConfirmed,
} from './events';
import { NewChatDetails } from './new-chat-details';
import { PendingParticipant } from './sub-models/pending-participant';

export interface ChatProps {
  title: string;
  description?: string;
  type: ChatType;
  participantLimit?: number;
  participantCount: number;
  allowedRoles: Role[];
  pendingParticipants: PendingParticipant[];
}

export class Chat extends StateAggregateBase<ChatProps> {
  static create(details: NewChatDetails) {
    const {
      creatorId,
      title,
      description,
      type,
      participantLimit,
      allowedRoles,
    } = details.props();

    const newChat = new ChatBuilder(this)
      .withProps({
        title,
        description,
        type,
        participantLimit,
        participantCount: 0,
        allowedRoles,
        pendingParticipants: [],
      })
      .build();

    newChat.recordEvent(ChatCreated, {
      creatorId,
      chatId: newChat.id(),
      title: newChat.title,
      type: newChat.type,
    });

    return newChat;
  }

  @Prop()
  declare title: string;

  @Prop()
  declare description?: string;

  @Prop()
  declare type: ChatType;

  @Prop()
  declare participantLimit?: number;

  @Prop()
  declare participantCount: number;

  @Prop()
  declare allowedRoles: Role[];

  @Prop()
  declare pendingParticipants: PendingParticipant[];

  get nonExpiredPendingParticipants() {
    return this.pendingParticipants.filter(
      (pendingParticipant) => !pendingParticipant.isExpired(),
    );
  }

  isRoleAllowed(role: Role) {
    return this.allowedRoles.some((_role) => _role.hasRoleMatching(role));
  }

  hasParticipantLimit() {
    return isNil(this.participantLimit);
  }

  canAddPendingParticipant() {
    if (!this.hasParticipantLimit()) return true;

    return (
      this.participantCount + this.nonExpiredPendingParticipants.length <
      this.participantLimit!
    );
  }

  getPendingParticipant(userId: Id) {
    return this._props.pendingParticipants.find(
      (pendingParticipant) => pendingParticipant.userId === userId,
    );
  }

  private removePendingParticipant(userId: Id) {
    this._props.pendingParticipants = this._props.pendingParticipants.filter(
      (pendingParticipant) => pendingParticipant.userId !== userId,
    );
  }

  private increaseParticipantCount() {
    this._props.participantCount++;
  }

  addPendingParticipant(userId: Id, roles: Role[], expirationTime: number) {
    if (!roles.every((role) => this.isRoleAllowed(role)))
      throw new Error('Invalid role');

    if (!this.canAddPendingParticipant())
      throw new Error('Cannot adding more pending participant to this chat');

    const newPendingParticipant = new PendingParticipant({
      chatId: this.id(),
      userId,
      roles,
      expiredAt: new Date(Date.now() + expirationTime),
    });

    this._props.pendingParticipants = this.pendingParticipants
      .filter(
        (pendingParticipant) =>
          !pendingParticipant.equals(newPendingParticipant),
      )
      .concat(newPendingParticipant);

    this.recordEvent(PendingParticipantAdded, {
      chatId: newPendingParticipant.chatId,
      userId: newPendingParticipant.userId,
    });

    return newPendingParticipant;
  }

  confirmPendingParticipant(userId: Id) {
    const cfPendingParticipant = this.getPendingParticipant(userId);

    if (!cfPendingParticipant) return;

    this.removePendingParticipant(userId);
    this.increaseParticipantCount();

    this.recordEvent(PendingParticipantConfirmed, {
      chatId: this.id(),
      userId,
    });
  }

  newParticipant(userId: Id): Participant {
    const pendingParticipant = this.getPendingParticipant(userId);

    if (!pendingParticipant) throw new Error('Pending participant not exist');

    if (pendingParticipant.isExpired())
      throw new Error('Pending participant is expired');

    const participant = Participant.create({
      chatId: this.id(),
      userId,
      roles: pendingParticipant.roles,
    });

    return participant;
  }
}

export class ChatBuilder extends StateAggregateBuilder<Chat> {}
