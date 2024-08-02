import { EventBase, Id } from 'ddd-node';
import { Nickname } from '../nickname';

export interface ParticipantNicknameChangedProps {
  initiatorId: Id;
  targetId: Id;
  nickname: Nickname;
}

export class ParticipantNicknameChanged extends EventBase<ParticipantNicknameChangedProps> {}
