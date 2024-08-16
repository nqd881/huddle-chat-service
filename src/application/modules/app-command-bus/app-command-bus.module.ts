import {
  AppCommandBus,
  IAppCommandHandler,
} from 'application/_base/app-command';
import { Type } from 'utils/types/type';
import { ContainerModuleX } from '../container-module-x';
import { AppCommandHandlerIdentifier } from './identifiers';

export interface AppCommandBusModuleOptions {
  commandBusIdentifier: string | symbol;
  commandHandlers: Type<IAppCommandHandler>[];
}

export class AppCommandBusModule extends ContainerModuleX {
  private commandBus = new AppCommandBus();

  constructor(private options: AppCommandBusModuleOptions) {
    super();
  }

  private commandHandlers() {
    return this.options.commandHandlers ?? [];
  }

  init(): void {
    this.bindCommandHandlers();
    this.bindCommandBus();
  }

  bindCommandHandlers() {
    this.onActivation<IAppCommandHandler>(
      AppCommandHandlerIdentifier,
      (context, instance) => {
        this.commandBus.registerHandler(instance);
        return instance;
      },
    );

    this.onDeactivation<IAppCommandHandler>(
      AppCommandHandlerIdentifier,
      (instance) => {
        this.commandBus.deregisterHandler(instance.commandType());
      },
    );

    this.commandHandlers().forEach((commandHandler) => {
      this.bind(AppCommandHandlerIdentifier).to(commandHandler);
    });
  }

  bindCommandBus() {
    const { commandBusIdentifier } = this.options;

    this.onActivation(commandBusIdentifier, (context, instance) => {
      context.container.getAll(AppCommandHandlerIdentifier);

      return instance;
    });

    this.bind(commandBusIdentifier).toConstantValue(this.commandBus);
  }
}
