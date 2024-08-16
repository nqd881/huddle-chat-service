import {
  AppCommandBus,
  IAppCommandBus,
  IAppCommandHandler,
} from 'application/_base/app-command';
import { Container } from 'inversify';
import { Type } from 'utils/types/type';

export class AppCommandBusContainer extends Container {
  static Identifiers = {
    CommandBus: Symbol.for('COMMAND_BUS'),
    CommandHandler: Symbol.for('COMMAND_HANDLER'),
  };

  private commandBus: IAppCommandBus = new AppCommandBus();

  constructor(private commandHandlers: Type<IAppCommandHandler>[]) {
    super();

    this.bindCommandHandlers();
    this.bindCommandBus();
  }

  bindCommandHandlers() {
    this.onActivation<IAppCommandHandler>(
      AppCommandBusContainer.Identifiers.CommandHandler,
      (context, instance) => {
        this.commandBus.registerHandler(instance);

        return instance;
      },
    );

    this.onDeactivation<IAppCommandHandler>(
      AppCommandBusContainer.Identifiers.CommandHandler,
      (instance) => {
        this.commandBus.deregisterHandler(instance.commandType());
      },
    );

    this.commandHandlers.forEach((commandHandler) => {
      this.bind(AppCommandBusContainer.Identifiers.CommandHandler).to(
        commandHandler,
      );
    });
  }

  bindCommandBus() {
    this.onActivation<IAppCommandBus>(
      AppCommandBusContainer.Identifiers.CommandBus,
      (context, instance) => {
        // context.container

        const handlers = this.getAll<IAppCommandHandler>(
          AppCommandBusContainer.Identifiers.CommandHandler,
        );

        instance.registerHandlers(handlers);

        return instance;
      },
    );

    this.bind(AppCommandBusContainer.Identifiers.CommandBus).toConstantValue(
      this.commandBus,
    );
  }
}
