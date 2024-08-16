import { ExecutionResult, StepBody, StepExecutionContext } from 'wfes';

export class LogResult extends StepBody {
  public result: {
    workflowId: string;
    chatId: string;
    participantId: string;
    invitationId: string;
  };

  async run(context: StepExecutionContext): Promise<ExecutionResult> {
    console.log(this.result);

    console.log('ENDDDDDDDDDD');

    return ExecutionResult.next();
  }
}
