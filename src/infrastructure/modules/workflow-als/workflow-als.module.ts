import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Module({
  providers: [{ provide: 'WORKFLOW_ALS', useValue: new AsyncLocalStorage() }],
  exports: ['WORKFLOW_ALS'],
})
export class workflowContextModule {}
