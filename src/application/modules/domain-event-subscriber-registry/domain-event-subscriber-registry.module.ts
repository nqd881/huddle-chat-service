import {
  EventSubscriberRegistry,
  IEventSubscriber,
  IGlobalEventSubscriber,
} from 'ddd-node';
import { Type } from 'utils/types/type';
import { ContainerModuleX } from '../container-module-x';
import {
  SubscriberIdentifier,
  GlobalSubscriberIdentifier,
} from './identifiers';

export interface DomainEventSubsrciberRegistryModuleOptions {
  registryIdentifier: string | symbol;
  globalSubscribers?: Type<IGlobalEventSubscriber>[];
  subscribers?: Type<IEventSubscriber>[];
}

export class DomainEventSubscriberRegistryModule extends ContainerModuleX {
  private eventSubscriberRegistry = new EventSubscriberRegistry();

  constructor(private options: DomainEventSubsrciberRegistryModuleOptions) {
    super();
  }

  init() {
    this.bindGlobalSubscribers();
    this.bindSubscribers();

    this.bindRegistry();
  }

  private globalSubscribers() {
    return this.options.globalSubscribers ?? [];
  }

  private subscribers() {
    return this.options.subscribers ?? [];
  }

  bindGlobalSubscribers() {
    this.listenToRegisterGlobalSubscriber();
    this.listenToDeregisterGlobalSubscriber();

    this.globalSubscribers().forEach((globalSubscriber) => {
      this.bind(GlobalSubscriberIdentifier).to(globalSubscriber);
    });
  }

  private listenToRegisterGlobalSubscriber() {
    this.onActivation<IGlobalEventSubscriber>(
      GlobalSubscriberIdentifier,
      (context, instance) => {
        this.eventSubscriberRegistry.registerGlobalSubscriber(instance);

        return instance;
      },
    );
  }

  private listenToDeregisterGlobalSubscriber() {
    this.onDeactivation<IGlobalEventSubscriber>(
      GlobalSubscriberIdentifier,
      (instance) => {
        this.eventSubscriberRegistry.deregisterGlobalSubscriber(instance);
      },
    );
  }

  bindSubscribers() {
    this.listenToRegisterSubscriber();
    this.listenToDeregisterSubscriber();

    this.subscribers().forEach((subscriber) => {
      this.bind(SubscriberIdentifier).to(subscriber);
    });
  }

  private listenToRegisterSubscriber() {
    this.onActivation<IEventSubscriber>(
      SubscriberIdentifier,
      (context, instance) => {
        this.eventSubscriberRegistry.registerSubscriber(instance);

        return instance;
      },
    );
  }

  private listenToDeregisterSubscriber() {
    this.onDeactivation<IEventSubscriber>(SubscriberIdentifier, (instance) => {
      this.eventSubscriberRegistry.deregisterSubscriber(instance);
    });
  }

  bindRegistry() {
    const { registryIdentifier } = this.options;

    this.onActivation(registryIdentifier, (context, instance) => {
      context.container.getAll(GlobalSubscriberIdentifier);
      context.container.getAll(SubscriberIdentifier);

      return instance;
    });

    this.bind(registryIdentifier).toConstantValue(this.eventSubscriberRegistry);
  }
}
