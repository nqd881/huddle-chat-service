import { IRepository } from 'ddd-node';
import { Invitation } from '../models/invitation';

export interface IInvitationRepo extends IRepository<Invitation> {}
