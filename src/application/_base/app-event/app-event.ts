import { v4 } from 'uuid';
import { IAppEvent, IAppEventMetadata } from './interface';

export class AppEvent<P extends object = {}> implements IAppEvent<P> {
  public readonly metadata: IAppEventMetadata;
  public readonly payload: P;

  constructor(payload: P, metadata: Partial<IAppEventMetadata> = {}) {
    this.payload = payload;
    this.metadata = {
      id: v4(),
      timestamp: Date.now(),
      ...metadata,
    };
  }

  get id() {
    return this.metadata.id;
  }

  get timestamp() {
    return this.metadata.timestamp;
  }
}
