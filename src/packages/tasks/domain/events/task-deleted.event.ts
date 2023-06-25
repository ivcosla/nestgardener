import { IssuerContext } from '../../../../lib/command-bus/issuerContext';

export type ITaskDeletedEvent = {
  data: {
    id: string;
  };
  context: IssuerContext & { command: string };
};

export class TaskDeletedEvent {
  constructor(
    public readonly data: ITaskDeletedEvent['data'],
    public readonly context: ITaskDeletedEvent['context'],
  ) {}
}
