import { IssuerContext } from '../../../../lib/command-bus/issuer-context';

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
