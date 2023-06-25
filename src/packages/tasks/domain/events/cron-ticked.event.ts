import { CronOrServiceIssuerContext } from '../../../../lib/command-bus/issuerContext';

export type ICronTickedEvent = {
  data: {
    commandType: string;
    command: Record<string, unknown>;
  };
  context: CronOrServiceIssuerContext;
};

export class CronTickedEvent {
  constructor(
    public readonly data: ICronTickedEvent['data'],
    public readonly context: ICronTickedEvent['context'],
  ) {}
}
