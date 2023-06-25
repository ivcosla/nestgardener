import { IssuerContext } from '../../../lib/command-bus/issuer-context';

export class WifiReconnectedEvent {
  constructor(
    public readonly data: {
      observedAt: Date;
    },
    public readonly context: IssuerContext,
  ) {}
}
