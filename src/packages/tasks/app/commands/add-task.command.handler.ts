import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { AddTaskCommand } from './add-task.command';
import { TasksService } from '../../domain/tasks.service';
import { Task } from '../../domain/task';
import { TaskAddedEvent } from '../../domain/events/task-added.event';
import { CommandResult } from '../../../../lib/command-bus/command-result';
import { CommandErroredEvent } from '../../../shared/generic-command-module/command-errored.domain.event';
import { err, ok } from 'neverthrow';

export type AddTaskHandlerResult = CommandResult<
  {
    data: Task;
    $events: [TaskAddedEvent];
  },
  {
    $events: [CommandErroredEvent];
  }
>;

@CommandHandler(AddTaskCommand)
export class AddTaskHandler {
  constructor(private tasksService: TasksService, private eventBus: EventBus) {}

  async execute(command: AddTaskCommand): Promise<AddTaskHandlerResult> {
    const { input } = command;

    try {
      await this.tasksService.addTask(input);

      const event = new TaskAddedEvent(input, {
        ...command.context,
        command: 'add-task',
      });

      this.eventBus.publish(event);

      return ok({
        data: input,
        $events: [event],
      });
    } catch (error) {
      console.log(error);
      const errorEvent = new CommandErroredEvent(command.context, {
        kind: 'exception in add-task',
        error,
      });

      this.eventBus.publish(errorEvent);

      return err({
        $events: [errorEvent],
      });
    }
  }
}
