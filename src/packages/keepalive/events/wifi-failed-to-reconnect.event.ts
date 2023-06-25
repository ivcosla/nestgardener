import { IssuerContext } from '../../../lib/command-bus/issuer-context';

export class WifiFailedToReconectEvent {
  constructor(
    public readonly data: {
      observedAt: Date;
      error: {
        kind: 'error';
        error: Error;
      };
    },
    public readonly context: IssuerContext,
  ) {}
}
