import { v4 } from 'uuid';
import { IAppCommand, IAppCommandMetadata } from './interfaces';
import { SetOptional } from 'type-fest';

export class AppCommand<P extends object = {}> implements IAppCommand<P> {
  public readonly metadata: IAppCommandMetadata;
  public readonly payload: P;

  constructor(
    payload: P,
    metadata: SetOptional<IAppCommandMetadata, 'id'> = {},
  ) {
    this.metadata = {
      id: v4(),
      timestamp: Date.now(),
      ...metadata,
    };
    this.payload = payload;
  }

  setMetadata(metadata: Omit<IAppCommandMetadata, 'id'>) {
    Object.keys(metadata).forEach((metadataKey) => {
      if (!this.metadata[metadataKey]) {
        this.metadata[metadataKey] = metadata[metadataKey];

        Object.freeze(this.metadata[metadataKey]);
      }
    });
  }

  get id() {
    return this.metadata.id;
  }

  get userId() {
    return this.metadata.userId;
  }

  get timestamp() {
    return this.metadata.timestamp;
  }

  get correlationId() {
    return this.metadata.correlationId;
  }

  get causationId() {
    return this.metadata.causationId;
  }
}
