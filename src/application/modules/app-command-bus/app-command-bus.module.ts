import {
  AppCommandBus,
  IAppCommandHandler,
} from 'application/_base/app-command';
import { Type } from 'utils/types/type';
import { ContainerModuleX } from '../container-module-x';
import { AppCommandBusToken, AppCommandHandlerToken } from './token';

export interface AppCommandBusModuleOptions {
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
      AppCommandHandlerToken,
      (context, instance) => {
        this.commandBus.registerHandler(instance);

        return instance;
      },
    );

    this.onDeactivation<IAppCommandHandler>(
      AppCommandHandlerToken,
      (instance) => {
        this.commandBus.deregisterHandler(instance.commandType());
      },
    );

    this.commandHandlers().forEach((commandHandler) => {
      this.bind(AppCommandHandlerToken).to(commandHandler);
    });
  }

  bindCommandBus() {
    this.bind(AppCommandBusToken).toConstantValue(this.commandBus);
  }
}
