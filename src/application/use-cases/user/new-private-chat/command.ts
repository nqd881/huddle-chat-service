import { Id } from 'ddd-node';
import { AppCommand } from 'application/_base/app-command';

export interface NewPrivateChatCommandPayload {
  targetUserId: Id;
}

export class NewPrivateChatCommand extends AppCommand<NewPrivateChatCommandPayload> {}
