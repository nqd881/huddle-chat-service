import { Invitation } from 'domain/models/invitation';
import { InMemoryRepo } from '../base/in-memory-repo';
import { IInvitationRepo } from 'domain/repositories/chat-join-invitation.repo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryInvitationRepo
  extends InMemoryRepo<Invitation>
  implements IInvitationRepo {}
