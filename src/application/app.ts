import { Container } from 'inversify';
import {
  IAppCommand,
  IAppCommandBus,
  IAppCommandHandler,
} from './_base/app-command';
import { ProcessStoreToken, RepoRegistryToken } from './app.token';
import { ActivateParticipant } from './domain-event-subscribers/activate-participant';
import { ConfirmPendingParticipant } from './domain-event-subscribers/confirm-pending-participant';
import { CreateParticipant } from './domain-event-subscribers/create-participant';
import { ProcessEventSubscriber } from './domain-event-subscribers/global/process-event-subscriber';
import {
  AppCommandBusModule,
  AppCommandBusToken,
  AppCommandHandlerToken,
} from './modules/app-command-bus';
import { DomainEventSubscriberRegistryModule } from './modules/domain-event-subscriber-registry';
import {
  ProcessRegistryModule,
  ProcessRegistryToken,
} from './modules/process-registry';
import { IRepoRegistry } from './output-ports/repo-registry';
import { IProcessRegistry, IProcessStore } from './process';
import { NewPrivateChatHandler } from './use-cases/user/new-private-chat';
import { NewUserHandler } from './use-cases/user/new-user';
import { AnyEvent, EventPublisher, IEventSubscriberRegistry } from 'ddd-node';

export class App extends Container {
  private static DOMAIN_EVENT_SUBSCRIBER_REGISTRY_TOKEN = Symbol.for(
    'DOMAIN_EVENT_SUBSCRIBER_REGISTRY_TOKEN',
  );
  private static PROCESS_EVENT_SUBSCRIBER_REGISTRY_TOKEN = Symbol.for(
    'PROCESS_EVENT_SUBSCRIBER_REGISTRY_TOKEN',
  );

  constructor(repoRegistry: IRepoRegistry, processStore: IProcessStore) {
    super({ skipBaseClassChecks: true });

    this.loadAppCommandBusModule();
    this.loadDomainEventSubscriberRegistryModule();
    this.loadProcessRegistryModule();

    this.bindRepoRegistry(repoRegistry);
    this.bindProcessStore(processStore);
  }

  loadAppCommandBusModule() {
    this.load(
      new AppCommandBusModule({
        commandHandlers: [NewUserHandler, NewPrivateChatHandler],
      }),
    );
  }

  loadDomainEventSubscriberRegistryModule() {
    this.load(
      new DomainEventSubscriberRegistryModule({
        registryToken: App.DOMAIN_EVENT_SUBSCRIBER_REGISTRY_TOKEN,
        // globalSubscribers: [ProcessEventSubscriber],
        subscribers: [
          CreateParticipant,
          ConfirmPendingParticipant,
          ActivateParticipant,
        ],
      }),
    );
  }

  loadProcessEventSubscriberRegistryModule() {
    this.load(
      new DomainEventSubscriberRegistryModule({
        registryToken: App.PROCESS_EVENT_SUBSCRIBER_REGISTRY_TOKEN,
        subscribers: [],
      }),
    );
  }

  loadProcessRegistryModule() {
    this.load(
      new ProcessRegistryModule({
        processes: [],
      }),
    );
  }

  bindRepoRegistry(repoRegistry: IRepoRegistry) {
    this.bind(RepoRegistryToken).toConstantValue(repoRegistry);
  }

  bindProcessStore(processStore: IProcessStore) {
    processStore.setRegistry(this.processRegistry());

    this.bind(ProcessStoreToken).toConstantValue(processStore);
  }

  commandBus() {
    console.log(this.getAll<IAppCommandHandler>(AppCommandHandlerToken));

    return this.get<IAppCommandBus>(AppCommandBusToken);
  }

  repoRegistry() {
    return this.get<IRepoRegistry>(RepoRegistryToken);
  }

  domainEventSubscriberRegistry() {
    return this.get<IEventSubscriberRegistry>(
      App.DOMAIN_EVENT_SUBSCRIBER_REGISTRY_TOKEN,
    );
  }

  processEventSubscriberRegistry() {
    return this.get<IEventSubscriberRegistry>(
      App.PROCESS_EVENT_SUBSCRIBER_REGISTRY_TOKEN,
    );
  }

  processRegistry() {
    return this.get<IProcessRegistry>(ProcessRegistryToken);
  }

  handleCommand(command: IAppCommand) {
    return this.commandBus().executeCommand(command);
  }

  domainEventPublisher() {
    return new EventPublisher(this.domainEventSubscriberRegistry());
  }

  processEventPublisher() {
    return new EventPublisher(this.processEventSubscriberRegistry());
  }

  handleDomainEvent(event: AnyEvent) {
    const { correlationId } = event.context() || {};

    if (correlationId && correlationId.startsWith('Process|'))
      return this.processEventPublisher().publish(event);

    return this.domainEventPublisher().publish(event);
  }
}
