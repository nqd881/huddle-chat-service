import { Participant } from '../models/participant';
import { ParticipantNicknameChanger } from '../models/participant/implementations/participant-nickname-changer';
import { Nickname } from '../models/participant/nickname';

export class ChangeNicknameService {
  constructor() {}

  changeNickname(
    initiatorParticipant: ParticipantNicknameChanger,
    targetParticipant: Participant,
    nickname: Nickname,
  ) {
    const nicknameChange = initiatorParticipant.initiateNicknameChange(
      targetParticipant.id(),
      nickname,
    );

    targetParticipant.changeNickname(nicknameChange);
  }
}
