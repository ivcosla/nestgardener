import { IssuerContext } from '../../../../lib/command-bus/issuerContext';

export class PinToggledEvent {
  constructor(
    readonly data: { pin: number; setValue: 0 | 1 },
    readonly context: IssuerContext,
  ) {}
}
