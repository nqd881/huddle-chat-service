import { AppCommand } from 'application/_base/app-command';

export interface NewUserCommandPayload {}

export class NewUserCommand extends AppCommand<NewUserCommandPayload> {}
