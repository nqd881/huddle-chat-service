import { InvitationEvent, InvitationEventProps } from './invitation-event';

export interface InvitationCancelledProps extends InvitationEventProps {}

export class InvitationCancelled extends InvitationEvent<InvitationCancelledProps> {}
