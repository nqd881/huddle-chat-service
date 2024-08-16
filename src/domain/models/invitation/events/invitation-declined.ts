import { InvitationEvent, InvitationEventProps } from './invitation-event';

export interface InvitationDeclinedProps extends InvitationEventProps {}

export class InvitationDeclined extends InvitationEvent<InvitationDeclinedProps> {}
