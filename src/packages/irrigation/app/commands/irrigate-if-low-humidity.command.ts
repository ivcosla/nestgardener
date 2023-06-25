import { IssuerContext } from '../../../../lib/command-bus/issuer-context';
import { PumpWaterCommand } from './pump-water.command';
import { ReadHumidityCommand } from './read-humidity.command';

type IIrrigateIfLowHumidityCommand = {
  input: {
    readHumidity: ReadHumidityCommand['input'];
    pumpWater: PumpWaterCommand['input'];
    whenHumidityUnder: number;
  };
  context: IssuerContext;
};

export class IrrigateIfLowHumidityCommand
  implements IIrrigateIfLowHumidityCommand
{
  constructor(
    readonly input: IIrrigateIfLowHumidityCommand['input'],
    readonly context: IIrrigateIfLowHumidityCommand['context'],
  ) {}
}
