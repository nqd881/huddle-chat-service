import { Event } from 'ddd-node';
import { InvitationEvent, InvitationEventProps } from './invitation-event';

export class InvitationAcceptedProps extends InvitationEventProps {}

@Event('INVITATION_ACCEPTED')
export class InvitationAccepted extends InvitationEvent<InvitationAcceptedProps> {}
