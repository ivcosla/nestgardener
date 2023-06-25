import { IssuerContext } from '../../../lib/command-bus/issuer-context';

export type ICommandErroredEvent = {
  context: IssuerContext;
  error: {
    kind: string;
    error: Error;
  };
};

export class CommandErroredEvent implements ICommandErroredEvent {
  constructor(
    public readonly context: ICommandErroredEvent['context'],
    public readonly error: ICommandErroredEvent['error'],
  ) {}
}
