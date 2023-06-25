import { IssuerContext } from '../../../../lib/command-bus/issuer-context';

export type IHumidityReadEvent = {
  context: IssuerContext & { command: string };
  data: {
    humidity: number;
    timestamp: Date;
  };
};

export class HumidityReadEvent implements IHumidityReadEvent {
  constructor(
    public readonly context: IHumidityReadEvent['context'],
    public readonly data: IHumidityReadEvent['data'],
  ) {}
}
