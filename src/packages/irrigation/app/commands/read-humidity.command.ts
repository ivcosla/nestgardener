import { IssuerContext } from '../../../../lib/command-bus/issuer-context';

type IReadHumidityCommand = {
  input: {
    type: 'ads1115';
    pin: 0 | 1 | 2 | 3;
  };
  context: IssuerContext;
};

export class ReadHumidityCommand implements IReadHumidityCommand {
  constructor(
    readonly input: IReadHumidityCommand['input'],
    readonly context: IReadHumidityCommand['context'],
  ) {}
}
