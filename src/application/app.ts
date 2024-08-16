import { AsyncLocalStorage } from 'async_hooks';
import { AnyEvent, EventPublisher, IEventSubscriberRegistry } from 'ddd-node';
import { Container, ContainerModule } from 'inversify';
import { ConsoleLogger, IWorkflowHost } from 'wfes';
import { IAppCommand, IAppCommandBus } from './_base/app-command';
import { IRepoRegistry } from './abstractions/repo-registry';
import {
  AppCommandBusIdentifier,
  DomainEventHandlingContextIdentifier,
  DomainEventSubscriberRegistryIdentifier,
  RepoRegistryIdentifier,
  WorkflowContextIdentifier,
  WorkflowHostIdentifier,
} from './app.identifiers';
import { DomainEventHandlingContext } from './domain-event-handling-context';
import { AddingParticipantStoryEventSubscribers } from './domain-event-subscribers';
import { WorkflowSubscriber } from './domain-event-subscribers/global/workflow';
import { AppCommandBusModule } from './modules/app-command-bus';
import { DomainEventSubscriberRegistryModule } from './modules/domain-event-subscriber-registry';
import { WorkflowModule } from './modules/workflow';
import { NewPrivateChatHandler } from './use-cases/user/new-private-chat';
import { NewUserHandler } from './use-cases/user/new-user';
import { InitiatePrivateChatWorkflow } from './workflow/initiate-private-chat/initiate-private-chat.workflow';
import { WorkflowContext } from './workflow/my-step-body';
import { ChangeNicknameHandler } from './use-cases/participant/change-nickname';
import { AssignRoleHandler } from './use-cases/participant/assign-role';
import { RevokeRoleHandler } from './use-cases/participant/revoke-role';

// export interface AppConfiguration {
//   modules: ContainerModule[],
// }

export class App extends Container {
  constructor(repoRegistry: IRepoRegistry) {
    super({ skipBaseClassChecks: true });

    this.bindRepoRegistry(repoRegistry);

    this.bindWorkflowContext(new AsyncLocalStorage());
    this.bindDomainEventHandlingContext(new AsyncLocalStorage());

    this.loadAppCommandBusModule();
    this.loadDomainEventSubscriberRegistryModule();
    this.loadWorkflowModule();
  }

  async start() {
    await this.workflowHost().start();
  }

  loadAppCommandBusModule() {
    const module = new AppCommandBusModule({
      commandBusIdentifier: AppCommandBusIdentifier,
      commandHandlers: [
        [NewUserHandler, NewPrivateChatHandler],
        [ChangeNicknameHandler, AssignRoleHandler, RevokeRoleHandler],
      ].flat(),
    });

    this.load(module);
  }

  loadDomainEventSubscriberRegistryModule() {
    const module = new DomainEventSubscriberRegistryModule({
      registryIdentifier: DomainEventSubscriberRegistryIdentifier,
      globalSubscribers: [WorkflowSubscriber],
      subscribers: [AddingParticipantStoryEventSubscribers].flat(),
    });

    this.load(module);
  }

  loadWorkflowModule() {
    const module = new WorkflowModule(
      {
        workflowHostIdentifier: WorkflowHostIdentifier,
        workflows: [InitiatePrivateChatWorkflow],
        logger: new ConsoleLogger(),
      },
      this,
    );

    this.load(module);
  }

  bindRepoRegistry(repoRegistry: IRepoRegistry) {
    this.bind(RepoRegistryIdentifier).toConstantValue(repoRegistry);
  }

  bindDomainEventHandlingContext(
    context: AsyncLocalStorage<DomainEventHandlingContext>,
  ) {
    this.bind(DomainEventHandlingContextIdentifier).toConstantValue(context);
  }

  bindWorkflowContext(context: AsyncLocalStorage<WorkflowContext>) {
    this.bind(WorkflowContextIdentifier).toConstantValue(context);
  }

  repoRegistry() {
    return this.get<IRepoRegistry>(RepoRegistryIdentifier);
  }

  workflowContext() {
    return this.get<AsyncLocalStorage<WorkflowContext>>(
      WorkflowContextIdentifier,
    );
  }

  domainEventHandlingContext() {
    return this.get<AsyncLocalStorage<DomainEventHandlingContext>>(
      DomainEventHandlingContextIdentifier,
    );
  }

  commandBus() {
    return this.get<IAppCommandBus>(AppCommandBusIdentifier);
  }

  workflowHost() {
    return this.get<IWorkflowHost>(WorkflowHostIdentifier);
  }

  domainEventSubscriberRegistry() {
    return this.get<IEventSubscriberRegistry>(
      DomainEventSubscriberRegistryIdentifier,
    );
  }

  handleCommand(command: IAppCommand) {
    return this.commandBus().executeCommand(command);
  }

  domainEventPublisher() {
    return new EventPublisher(this.domainEventSubscriberRegistry());
  }

  handleDomainEvent(event: AnyEvent) {
    return this.domainEventHandlingContext().run({ event }, () =>
      this.domainEventPublisher().publish(event),
    );
  }
}
