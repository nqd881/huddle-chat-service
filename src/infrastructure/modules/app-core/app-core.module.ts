import { Module } from '@nestjs/common';
import { App } from 'application/app';
import { IRepoRegistry } from 'application/output-ports/repo-registry';
import { IProcessStore } from 'application/process';
import { PROCESS_STORE, ProcessStoreModule } from '../process-store';
import { RepoRegistryModule } from '../repo-registry';
import { RepoRegistry } from '../repo-registry/repo-registry';
import { APP_CORE } from './token';

@Module({
  imports: [RepoRegistryModule, ProcessStoreModule],
  providers: [
    {
      provide: APP_CORE,
      useFactory: (
        repoRegistry: IRepoRegistry,
        processStore: IProcessStore,
      ) => {
        const app = new App(repoRegistry, processStore);

        return app;
      },
      inject: [RepoRegistry, PROCESS_STORE],
    },
  ],
  exports: [APP_CORE],
})
export class AppCoreModule {}
