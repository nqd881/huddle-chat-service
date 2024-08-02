import { ChatJoinInvitation } from 'domain/models/chat-join-invitation';
import { InMemoryRepo } from '../base/in-memory-repo';
import { IChatJoinInvitationRepo } from 'domain/repositories/chat-join-invitation.repo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryInvitationRepo
  extends InMemoryRepo<ChatJoinInvitation>
  implements IChatJoinInvitationRepo {}
