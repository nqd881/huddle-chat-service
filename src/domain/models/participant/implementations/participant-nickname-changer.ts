import { Id } from 'ddd-node';
import { Participant } from '../participant';
import { Nickname } from '../nickname';
import { ChangeNicknamePermission } from '../../permission';
import { ParticipantNicknameChange } from '../participant-nickname-change';

export class ParticipantNicknameChanger extends Participant {
  initiateNicknameChange(participantId: Id, nickname: Nickname) {
    const canChangeNickname = this.isEligibleForPermission(
      ChangeNicknamePermission,
    );

    if (!canChangeNickname) throw new Error();

    return new ParticipantNicknameChange({
      chatId: this.chatId,
      initiatorId: this.id(),
      targetId: participantId,
      nickname,
    });
  }
}
