import { defineProcessType } from '../metadata';
import { Process } from '../process';

export const ProcessType = (processType: string) => {
  return (target: typeof Process<any>) => {
    defineProcessType(target, processType);
  };
};
