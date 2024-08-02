export interface IAppEventMetadata {
  readonly id: string;
  readonly timestamp?: number;
}

export interface IAppEvent<P extends object = {}> extends IAppEventMetadata {
  payload: P;
}
