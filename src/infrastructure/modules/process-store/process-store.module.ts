import { Module } from '@nestjs/common';
import { PROCESS_STORE } from './token';
import { InMemoryProcessStore } from './in-memory-process-store';

@Module({
  providers: [
    {
      provide: PROCESS_STORE,
      useClass: InMemoryProcessStore,
    },
  ],
  exports: [PROCESS_STORE],
})
export class ProcessStoreModule {}
