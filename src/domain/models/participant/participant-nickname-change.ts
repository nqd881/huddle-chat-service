import { Id, Prop, ValueObjectBase } from 'ddd-node';
import { Nickname } from './nickname';

export interface ParticipantNicknameChangeProps {
  chatId: Id;
  initiatorId: Id;
  targetId: Id;
  nickname: Nickname;
}

export class ParticipantNicknameChange extends ValueObjectBase<ParticipantNicknameChangeProps> {
  @Prop()
  declare chatId: Id;

  @Prop()
  declare initiatorId: Id;

  @Prop()
  declare targetId?: Id;

  @Prop()
  declare nickname: Nickname;

  isSelfChange() {
    return this.initiatorId === this.targetId;
  }
}
