import {
  EventSubscriberRegistry,
  IEventSubscriber,
  IGlobalEventSubscriber,
} from 'ddd-node';
import { Type } from 'utils/types/type';
import { ContainerModuleX } from '../container-module-x';
import {
  DomainEventSubscriberToken,
  GlobalDomainEventSubscriberToken,
} from './token';

export interface DomainEventSubsrciberRegistryModuleOptions {
  registryToken: string | symbol;
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

  private registryToken() {
    return this.options.registryToken;
  }

  private globalSubscribers() {
    return this.options.globalSubscribers ?? [];
  }

  private subscribers() {
    return this.options.subscribers ?? [];
  }

  bindGlobalSubscribers() {
    this.listenToRegisterGlobalEventSubscriber();
    this.listenToDeregisterGlobalEventSubscriber();

    this.globalSubscribers().forEach((globalSubscriber) => {
      this.bind(GlobalDomainEventSubscriberToken).to(globalSubscriber);
    });
  }

  private listenToRegisterGlobalEventSubscriber() {
    this.onActivation<IGlobalEventSubscriber>(
      GlobalDomainEventSubscriberToken,
      (context, instance) => {
        this.eventSubscriberRegistry.registerGlobalSubscriber(instance);

        return instance;
      },
    );
  }

  private listenToDeregisterGlobalEventSubscriber() {
    this.onDeactivation<IGlobalEventSubscriber>(
      GlobalDomainEventSubscriberToken,
      (instance) => {
        this.eventSubscriberRegistry.deregisterGlobalSubscriber(instance);
      },
    );
  }

  bindSubscribers() {
    this.listenToRegisterSubscriber();
    this.listenToDeregisterSubscriber();

    this.subscribers().forEach((subscriber) => {
      this.bind(DomainEventSubscriberToken).to(subscriber);
    });
  }

  private listenToRegisterSubscriber() {
    this.onActivation<IEventSubscriber>(
      DomainEventSubscriberToken,
      (context, instance) => {
        this.eventSubscriberRegistry.registerSubscriber(instance);

        return instance;
      },
    );
  }

  private listenToDeregisterSubscriber() {
    this.onDeactivation<IEventSubscriber>(
      DomainEventSubscriberToken,
      (instance) => {
        this.eventSubscriberRegistry.deregisterSubscriber(instance);
      },
    );
  }

  bindRegistry() {
    this.bind(this.registryToken()).toConstantValue(
      this.eventSubscriberRegistry,
    );
  }
}
