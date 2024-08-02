import { Process, ProcessClass } from 'application/process';
import { ContainerModuleX } from '../container-module-x';
import { ProcessRegistry } from './process-registry';
import { ProcessRegistryToken } from './token';

export interface ProcessRegistryModuleOptions {
  processes?: ProcessClass[];
}

export class ProcessRegistryModule extends ContainerModuleX {
  private processRegistry = new ProcessRegistry();

  constructor(private options: ProcessRegistryModuleOptions) {
    super();
  }

  init(): void {
    this.registerProcesses();

    this.bindProcessRegistry();
  }

  private processes() {
    return this.options.processes ?? [];
  }

  registerProcesses() {
    this.processes().forEach((process) => {
      this.processRegistry.registerProcess(process);
    });
  }

  bindProcessRegistry() {
    this.bind(ProcessRegistryToken).toConstantValue(this.processRegistry);
  }
}
