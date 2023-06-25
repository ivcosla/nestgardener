import { IssuerContext } from '../../../../lib/command-bus/issuer-context';

export class WaterPumpedEvent {
  constructor(
    readonly data: { pin: number; pumpDuration: number; observedAt: Date },
    readonly context: IssuerContext,
  ) {}
}
