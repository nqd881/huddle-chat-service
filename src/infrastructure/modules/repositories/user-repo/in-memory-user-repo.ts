import { IUserRepo } from 'domain/repositories';
import { InMemoryRepo } from '../base/in-memory-repo';
import { User } from 'domain/models/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryUserRepo extends InMemoryRepo<User> implements IUserRepo {
  userOfId(id: string): Promise<User | null> {
    return this.findById(id);
  }
}
