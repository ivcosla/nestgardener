import { IssuerContext } from '../../../../lib/command-bus/issuer-context';

export type IDeleteTaskCommand = {
  input: {
    id: string;
  };
  context: IssuerContext;
};

export class DeleteTaskCommand implements IDeleteTaskCommand {
  constructor(
    public readonly input: IDeleteTaskCommand['input'],
    public readonly context: IssuerContext,
  ) {}
}
