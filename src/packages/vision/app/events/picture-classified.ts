import { IssuerContext } from '../../../../lib/command-bus/issuer-context';

export class PictureClassifiedEvent {
  constructor(
    public readonly data: {
      picture: string;
      classification: string;
    },
    public readonly context: IssuerContext,
  ) {}
}
