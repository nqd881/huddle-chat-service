const ProcessTypeMetaKey = Symbol.for('PROCESS_TYPE');

export const defineProcessType = (target: object, processType: string) => {
  Reflect.defineMetadata(ProcessTypeMetaKey, processType, target);
};

export const getProcessType = (target: object): string | undefined => {
  return Reflect.getOwnMetadata(ProcessTypeMetaKey, target);
};
