import { IssuerContext } from '../../../../lib/command-bus/issuer-context';

export class PinToggledEvent {
  constructor(
    readonly data: { pin: number; setValue: 0 | 1 },
    readonly context: IssuerContext,
  ) {}
}
