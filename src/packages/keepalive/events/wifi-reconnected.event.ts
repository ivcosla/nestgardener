import { IssuerContext } from '../../../lib/command-bus/issuerContext';

export class WifiReconnectedEvent {
  constructor(
    public readonly data: {
      observedAt: Date;
    },
    public readonly context: IssuerContext,
  ) {}
}
