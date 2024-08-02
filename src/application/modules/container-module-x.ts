import { ContainerModule, interfaces } from 'inversify';

export abstract class ContainerModuleX extends ContainerModule {
  constructor() {
    super(
      (
        bind,
        unbind,
        isBound,
        rebind,
        unbinAsync,
        onActivation,
        onDeactivation,
      ) => {
        this.bind = bind;
        this.unbind = unbind;
        this.isBound = isBound;
        this.rebind = rebind;
        this.unbinAsync = unbinAsync;
        this.onActivation = onActivation;
        this.onDeactivation = onDeactivation;

        this.init();
      },
    );
  }

  abstract init(): void;

  bind: interfaces.Bind;
  unbind: interfaces.Unbind;
  isBound: interfaces.IsBound;
  rebind: interfaces.Rebind;
  unbinAsync: interfaces.UnbindAsync;
  onActivation: interfaces.Container['onActivation'];
  onDeactivation: interfaces.Container['onDeactivation'];
}
