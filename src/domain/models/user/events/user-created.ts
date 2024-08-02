import { Event, EventBase } from 'ddd-node';

export interface UserCreatedProps {}

@Event('USER_CREATED')
export class UserCreated extends EventBase<UserCreatedProps> {}
