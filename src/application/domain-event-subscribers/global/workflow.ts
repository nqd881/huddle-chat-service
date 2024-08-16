import { WorkflowHostIdentifier } from 'application/app.identifiers';
import { AnyEvent, IGlobalEventSubscriber } from 'ddd-node';
import { inject, injectable } from 'inversify';
import { IWorkflowHost } from 'wfes';

@injectable()
export class WorkflowSubscriber implements IGlobalEventSubscriber {
  constructor(
    @inject(WorkflowHostIdentifier) private workflowHost: IWorkflowHost,
  ) {}

  async handleEvent(event: AnyEvent): Promise<void> {
    const { workflowId } = event.correlationIds();

    if (!workflowId) return;

    await this.workflowHost.publishEvent(
      event.eventType(),
      workflowId,
      event,
      new Date(),
    );
  }
}
