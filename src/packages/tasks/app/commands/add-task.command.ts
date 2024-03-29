import { IssuerContext } from '../../../../lib/command-bus/issuer-context';
import { Task } from '../../domain/task';

export type IAddTaskCommand = {
  input: Task;
  context: IssuerContext;
};

export class AddTaskCommand implements IAddTaskCommand {
  constructor(
    public readonly input: Task,
    public readonly context: IssuerContext,
  ) {}
}
