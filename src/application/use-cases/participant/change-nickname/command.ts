import { AppCommand } from 'application/_base/app-command';

export interface ChangeNicknameCommandPayload {
  chatId: string;
  targetParticipantId: string;
  nickname: string;
}

export class ChangeNicknameCommand extends AppCommand<ChangeNicknameCommandPayload> {}
