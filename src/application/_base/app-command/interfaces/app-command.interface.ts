export interface IAppCommandMetadata {
  id: string;
  userId?: string;
  timestamp?: number;
  correlationId?: string;
  causationId?: string;
}

export interface IAppCommand<P extends object = {}>
  extends IAppCommandMetadata {
  payload: P;
}

export type PayloadOf<T extends IAppCommand> = T extends IAppCommand<infer P>
  ? P
  : never;
