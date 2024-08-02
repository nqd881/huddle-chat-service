import { IProcessRegistry, ProcessClass } from 'application/process';

export class ProcessRegistry implements IProcessRegistry {
  private processMap: Map<string, ProcessClass> = new Map();

  registerProcess(processClass: ProcessClass): void {
    this.processMap.set(processClass.type(), processClass);
  }

  deregisterProcess(processClass: ProcessClass): void {
    this.processMap.delete(processClass.type());
  }

  processOfType(type: string) {
    return this.processMap.get(type);
  }
}
