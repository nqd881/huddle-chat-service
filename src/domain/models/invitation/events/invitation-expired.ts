import { InvitationEvent, InvitationEventProps } from './invitation-event';

export interface InvitationExpiredProps extends InvitationEventProps {}

export class InvitationExpired extends InvitationEvent<InvitationExpiredProps> {}
