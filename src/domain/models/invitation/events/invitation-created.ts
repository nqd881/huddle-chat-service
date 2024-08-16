import { Event } from 'ddd-node';
import { InvitationEvent, InvitationEventProps } from './invitation-event';

export interface InvitationCreatedProps extends InvitationEventProps {}

@Event('INVITATION_CREATED')
export class InvitationCreated extends InvitationEvent<InvitationCreatedProps> {}
