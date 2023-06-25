import { IssuerContext } from '../../../../lib/command-bus/issuerContext';

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
