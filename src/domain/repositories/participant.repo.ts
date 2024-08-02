import { IRepository, Id } from 'ddd-node';
import { Participant } from '../models/participant';

export interface IParticipantRepo extends IRepository<Participant> {
  participantOfId(id: Id): Promise<Participant | null>;
  participantOfChat(chatId: Id, userId: Id): Promise<Participant | null>;
}
