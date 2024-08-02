import { AnyEvent, IGlobalEventSubscriber } from 'ddd-node';
import { inject, injectable } from 'inversify';
import { ProcessStoreToken } from '../../app.token';
import { IProcessStore } from '../../process/process-store';

@injectable()
export class ProcessEventSubscriber<T extends AnyEvent>
  implements IGlobalEventSubscriber
{
  constructor(@inject(ProcessStoreToken) private processStore: IProcessStore) {}

  async handleEvent(event: T): Promise<void> {
    const { correlationId } = event.context() || {};

    if (!correlationId) return;

    if (!correlationId.startsWith('Process|')) return;

    const processId = correlationId.slice('Process|'.length);

    const process = await this.processStore.processOfId(processId);

    if (!process) throw new Error('Process not found');

    await process.handleEvent(event);

    await this.processStore.store(process);
  }
}
