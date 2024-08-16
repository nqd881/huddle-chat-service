import { Event, EventBase, Id } from 'ddd-node';
import { Nickname } from '../nickname';

export interface ParticipantNicknameChangedProps {
  initiatorId: Id;
  targetId: Id;
  nickname: Nickname;
}

@Event('PARTICIPANT_NICKNAME_CHANGED')
export class ParticipantNicknameChanged extends EventBase<ParticipantNicknameChangedProps> {}
