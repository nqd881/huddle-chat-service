import { Container } from 'inversify';
import { Type } from 'utils/types/type';
import {
  IDistributedLockProvider,
  ILogger,
  IPersistenceProvider,
  IQueueProvider,
  WorkflowBase,
  WorkflowConfig,
  configureWorkflow,
} from 'wfes';
import { ContainerModuleX } from '../container-module-x';

export interface WorkflowModuleOptions {
  workflowHostIdentifier: string | symbol;
  workflows: Type<WorkflowBase<any>>[];
  logger?: ILogger;
  persistence?: IPersistenceProvider;
  queueManager?: IQueueProvider;
  lockManager?: IDistributedLockProvider;
}

export class WorkflowModule extends ContainerModuleX {
  private config: WorkflowConfig;

  constructor(
    private options: WorkflowModuleOptions,
    private parentContainer?: Container,
  ) {
    super();
  }

  init(): void {
    this.config = configureWorkflow();

    if (this.options.persistence)
      this.config.usePersistence(this.options.persistence);

    if (this.options.logger) this.config.useLogger(this.options.logger);

    if (this.options.queueManager)
      this.config.useQueueManager(this.options.queueManager);

    if (this.options.lockManager)
      this.config.useLockManager(this.options.lockManager);

    if (this.parentContainer)
      this.config.getContainer().parent = this.parentContainer;

    this.registerWorkflows();
    this.bindWorkflowHost();
  }

  private registerWorkflows() {
    const host = this.config.getHost();

    this.options.workflows.forEach((workflow) => {
      host.registerWorkflow(workflow);
    });
  }

  private bindWorkflowHost() {
    const { workflowHostIdentifier } = this.options;

    this.bind(workflowHostIdentifier).toConstantValue(this.config.getHost());
  }
}
