import { AnyAggregate, IRepository, Id } from 'ddd-node';

export class InMemoryRepo<T extends AnyAggregate> implements IRepository<T> {
  protected records: Map<Id, T> = new Map();

  async save(instance: T): Promise<any> {
    this.records.set(instance.id(), instance);
  }

  async findById(id: string): Promise<T | null> {
    return this.records.get(id) ?? null;
  }
}
