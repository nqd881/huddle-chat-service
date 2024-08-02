import { mapKeys, pickBy } from 'lodash';
import {
  IHandledEvent,
  IProcessRegistry,
  IProcessStore,
  Process,
  ProcessStatus,
} from 'application/process';

export interface InMemoryStoredProcess {
  _type: string;
  _id: string;
  _status: string;
  _timeoutAt?: Date;
  _handledEvents?: string[];
}

export class InMemoryProcessStore implements IProcessStore {
  protected processRegistry: IProcessRegistry;
  protected processMap: Map<string, InMemoryStoredProcess> = new Map();

  setRegistry(processRegistry: IProcessRegistry): void {
    this.processRegistry = processRegistry;
  }

  async processOfId(processId: string): Promise<Process | null> {
    const storedProcess = this.processMap.get(processId);

    if (!storedProcess) return null;

    return this.deserializeProcess(storedProcess);
  }

  async store(process: Process): Promise<void> {
    const storedProcess = this.serializeProcess(process);

    this.processMap.set(process.id, storedProcess);

    console.log('Process map', this.processMap);
  }

  serializeProcess(process: Process): InMemoryStoredProcess {
    const serializedProcessState = mapKeys(
      process.state || {},
      (value, key) => {
        return `s_${key}`;
      },
    );

    const serializedProcessInput = mapKeys(
      process.input || {},
      (value, key) => {
        return `i_${key}`;
      },
    );

    return {
      _type: process.type,
      _id: process.id,
      _status: this.serializeProcessStatus(process.status),
      _timeoutAt: process.timeoutAt,
      _handledEvents: process.handledEvents.map((handledEvent) =>
        this.serializeHandledEvent(handledEvent),
      ),
      ...serializedProcessInput,
      ...serializedProcessState,
    };
  }

  serializeProcessStatus(processStatus: ProcessStatus): string {
    return processStatus.valueOf();
  }

  serializeHandledEvent(handledEvent: IHandledEvent): string {
    return `${handledEvent.eventType}||${handledEvent.eventId}`;
  }

  deserializeProcess(storedProcess: InMemoryStoredProcess): Process {
    const processType = storedProcess._type;

    const processClass = this.processRegistry.processOfType(processType);

    if (!processClass) throw new Error('Process is not registered');

    let processState = pickBy(storedProcess, (value, key) => {
      return key.startsWith('s_');
    });

    processState = mapKeys(processState, (value, key) => {
      return key.slice('s_'.length);
    });

    let processInput = pickBy(storedProcess, (value, key) => {
      return key.startsWith('i_');
    });

    processInput = mapKeys(processInput, (value, key) => {
      return key.slice('i_'.length);
    });

    return new processClass({
      id: storedProcess._id,
      status: this.deserializeProcessStatus(storedProcess._status),
      input: processInput,
      state: processState,
      timeoutAt: storedProcess._timeoutAt,
      handledEvents: storedProcess._handledEvents?.map((handledEvent) =>
        this.deserializeHandledEvent(handledEvent),
      ),
    });
  }

  deserializeProcessStatus(serializedStatus: string): ProcessStatus {
    switch (serializedStatus) {
      case ProcessStatus.Running.valueOf():
        return ProcessStatus.Running;
      case ProcessStatus.Completed.valueOf():
        return ProcessStatus.Completed;
      case ProcessStatus.Cancelled.valueOf():
        return ProcessStatus.Cancelled;
      case ProcessStatus.TimedOut.valueOf():
        return ProcessStatus.TimedOut;
      default:
        throw new Error('Invalid process status value');
    }
  }

  deserializeHandledEvent(serializedHandledEvent: string): IHandledEvent {
    const [eventType, eventId] = serializedHandledEvent.split('||');

    return { eventType, eventId };
  }
}
