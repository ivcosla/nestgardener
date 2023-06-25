import { IssuerContext } from '../../../../lib/command-bus/issuerContext';

type IPumpWaterCommand = {
  input: {
    pin: number;
    durationInMilliseconds: number;
  };
  context: IssuerContext;
};

export class PumpWaterCommand implements IPumpWaterCommand {
  constructor(
    readonly input: IPumpWaterCommand['input'],
    readonly context: IPumpWaterCommand['context'],
  ) {}
}
