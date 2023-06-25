import { IssuerContext } from '../../../../lib/command-bus/issuer-context';
import { Task } from '../task';

export type ITaskAddedEvent = {
  data: Task;
  context: IssuerContext & { command: string };
};

export class TaskAddedEvent implements ITaskAddedEvent {
  constructor(
    public readonly data: ITaskAddedEvent['data'],
    public readonly context: ITaskAddedEvent['context'],
  ) {}
}
