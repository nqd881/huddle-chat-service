import { Model, Prop, PropsValidator, ValueObjectBase } from 'ddd-node';

export interface NicknameProps {
  value: string;
}

@Model({
  propsValidator: Nickname.PropsValidator,
})
export class Nickname extends ValueObjectBase<NicknameProps> {
  static PropsValidator: PropsValidator<Nickname> = (props: NicknameProps) => {
    const { value } = props;

    if (!value.trim().length) throw new Error('Nickname cannot be empty');
  };

  @Prop()
  declare value: string;
}
