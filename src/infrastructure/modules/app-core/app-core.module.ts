import { Module, forwardRef } from '@nestjs/common';
import { App } from 'application/app';
import { IRepoRegistry } from 'application/abstractions';
import { EventStoreModule } from '../event-store';
import { RepoRegistryModule } from '../repo-registry';
import { RepoRegistry } from '../repo-registry/repo-registry';
import { APP_CORE } from './token';

@Module({
  imports: [forwardRef(() => EventStoreModule), RepoRegistryModule],
  providers: [
    {
      provide: APP_CORE,
      useFactory: async (repoRegistry: IRepoRegistry) => {
        const app = new App(repoRegistry);

        await app.start();

        return app;
      },
      inject: [RepoRegistry],
    },
  ],
  exports: [APP_CORE],
})
export class AppCoreModule {}
