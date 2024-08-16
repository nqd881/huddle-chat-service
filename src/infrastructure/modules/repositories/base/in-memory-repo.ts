import { Inject, Injectable } from '@nestjs/common';
import {
  AnyAggregate,
  IAggregateEventDispatcher,
  IRepository,
  Id,
} from 'ddd-node';
import { EVENT_STORE, IEventStore } from 'infrastructure/modules/event-store';

@Injectable()
export class InMemoryRepo<T extends AnyAggregate> implements IRepository<T> {
  protected records: Map<Id, T> = new Map();

  constructor(@Inject(EVENT_STORE) private eventStore: IEventStore) {}

  eventDispatcher(): IAggregateEventDispatcher {
    return {
      dispatch: (event) => {
        this.eventStore.append(event);
      },
    };
  }

  async save(instance: T): Promise<any> {
    this.records.set(instance.id(), instance);

    instance.dispatchEvents(this.eventDispatcher());

    this.eventStore.store();
  }

  async findById(id: string): Promise<T | null> {
    return this.records.get(id) ?? null;
  }
}
