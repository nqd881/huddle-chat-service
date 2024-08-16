// export * from './create-participant';
// export * from './confirm-pending-participant';
// export * from './activate-participant';

import { ActivateParticipant } from './activate-participant';
import { ConfirmPendingParticipant } from './confirm-pending-participant';
import { CreateParticipant } from './create-participant';

export const AddingParticipantStoryEventSubscribers = [
  CreateParticipant,
  ConfirmPendingParticipant,
  ActivateParticipant,
];
