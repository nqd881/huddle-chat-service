import { ContainerModule } from 'inversify';

export interface AppXConfig {
  modules: ContainerModule[];
}

export class AppX {
  constructor(config: AppXConfig) {}
}
