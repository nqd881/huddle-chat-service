import { AnyEvent } from 'ddd-node';
import { Class } from 'type-fest';
import { IEventHandler, getEventHandlerMap, getProcessType } from './metadata';

export class ProcessStatus {
  static readonly Running = new ProcessStatus('running');
  static readonly Completed = new ProcessStatus('completed');
  static readonly Cancelled = new ProcessStatus('cancelled');
  static readonly TimedOut = new ProcessStatus('time_out');

  private constructor(private value: string) {}

  valueOf() {
    return this.value;
  }

  isRunning() {
    return this === ProcessStatus.Running;
  }

  isCompleted() {
    return this === ProcessStatus.Completed;
  }

  isCancelled() {
    return this === ProcessStatus.Cancelled;
  }

  isTimedOut() {
    return this === ProcessStatus.TimedOut;
  }
}

export interface IHandledEvent {
  eventId: string;
  eventType: string;
}

export interface ProcessOptions<Input, State> {
  id: string;
  input: Input;
  state: State;
  status: ProcessStatus;
  timeoutAt?: Date;
  handledEvents?: IHandledEvent[];
}

export abstract class Process<Input = any, State = any> {
  static type() {
    const type = getProcessType(this);

    if (!type) throw new Error();

    return type;
  }

  public readonly type: string;
  public readonly id: string;
  public readonly input: Input;
  public state: State;
  public status: ProcessStatus;
  public readonly timeoutAt?: Date;
  public readonly handledEvents: IHandledEvent[];

  constructor(options: ProcessOptions<Input, State>) {
    this.type = (this.constructor as typeof Process).type();
    this.id = options.id;
    this.input = options.input;
    this.state = options.state;
    this.status = options.status;
    this.timeoutAt = options.timeoutAt;
    this.handledEvents = options.handledEvents ?? [];

    this.updateStatus();
  }

  updateStatus() {
    if (!this.status.isRunning()) return;

    if (this.checkTimedOut()) {
      this.status = ProcessStatus.TimedOut;
      return;
    }

    if (this.checkCompleted()) {
      this.status = ProcessStatus.Completed;
      return;
    }
  }

  protected abstract checkCompleted(): boolean;

  protected checkTimedOut() {
    if (!this.timeoutAt) return false;

    return Date.now() > this.timeoutAt.getTime();
  }

  isEventHandled<T extends AnyEvent>(event: T) {
    return this.handledEvents.some(
      (handledEvent) =>
        handledEvent.eventId === event.id() &&
        handledEvent.eventType === event.eventType(),
    );
  }

  getEventHandlerMap() {
    return getEventHandlerMap(this.constructor);
  }

  getEventHandler<T extends AnyEvent>(
    eventType: string,
  ): IEventHandler<T> | undefined {
    return this.getEventHandlerMap().get(eventType);
  }

  async handleEvent<T extends AnyEvent>(event: T) {
    this.updateStatus();

    if (!this.status.isRunning()) throw new Error('Process is not running');

    if (this.isEventHandled(event)) throw new Error('Event is handled before');

    const eventHandler = this.getEventHandler<T>(event.eventType());

    if (!eventHandler) throw new Error('Event handler not found');

    await eventHandler.call(this, event);

    this.handledEvents.push({
      eventId: event.id(),
      eventType: event.eventType(),
    });

    this.updateStatus();
  }

  cancel() {
    if (!this.status.isRunning())
      throw new Error('Cannot cancel in-running process');

    this.status = ProcessStatus.Cancelled;
  }
}

export type ProcessClass<Input = any, State = any> = Omit<
  typeof Process,
  'constructor'
> &
  Class<
    Process<Input, State>,
    ConstructorParameters<typeof Process<Input, State>>
  >;
