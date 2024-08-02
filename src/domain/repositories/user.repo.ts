import { IRepository, Id } from 'ddd-node';
import { User } from '../models/user';

export interface IUserRepo extends IRepository<User> {
  userOfId(id: Id): Promise<User | null>;
}
