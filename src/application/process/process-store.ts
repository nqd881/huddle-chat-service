import { Process } from './process';
import { IProcessRegistry } from './process-registry';

export interface IProcessStore {
  setRegistry(registry: IProcessRegistry): void;
  store(process: Process): Promise<void>;
  processOfId(processId: string): Promise<Process | null>;
}
