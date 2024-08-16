import { AppCommand } from 'application/_base/app-command';

export interface AssignRoleCommandPayload {
  chatId: string;
  targetParticipantId: string;
  roles: string[];
}

export class AssignRoleCommand extends AppCommand<AssignRoleCommandPayload> {}
