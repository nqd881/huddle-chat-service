import { ProcessClass } from './process';

export interface IProcessRegistry {
  registerProcess(processClass: ProcessClass): void;
  deregisterProcess(processClass: ProcessClass): void;
  processOfType(type: string): ProcessClass | undefined;
}
