import { AppCommand } from 'application/_base/app-command';

export interface RevokeRoleCommandPayload {
  chatId: string;
  targetParticipantId: string;
  roles: string[];
}

export class RevokeRoleCommand extends AppCommand<RevokeRoleCommandPayload> {}
