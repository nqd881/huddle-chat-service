import { IProcessStore } from 'application/process/process-store';
import { AnyEvent, EventSubscriber } from 'ddd-node';

export abstract class ProcessEventSubscriber<
  T extends AnyEvent,
> extends EventSubscriber<T> {
  constructor(private processStore: IProcessStore) {
    super();
  }

  async handleEvent(event: T): Promise<void> {
    const { processId } = event.correlationIds();
  }
}
