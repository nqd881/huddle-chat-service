import {
  IChatRepo,
  IMessageRepo,
  IParticipantRepo,
  IUserRepo,
} from 'domain/repositories';
import { IChatJoinInvitationRepo } from 'domain/repositories/chat-join-invitation.repo';

export interface IRepoRegistry {
  userRepo(): IUserRepo;

  chatRepo(): IChatRepo;

  participantRepo(): IParticipantRepo;

  invitationRepo(): IChatJoinInvitationRepo;

  // messageRepo(): IMessageRepo;
}
