import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteTaskCommand } from './delete-task.command';
import { TaskDeletedEvent } from '../../domain/events/task-deleted.event';
import { TasksService } from '../tasks.service';

export type DeleteTaskCommandHandlerResult = {
  $events: [TaskDeletedEvent];
};

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler {
  constructor(private tasksService: TasksService, private eventBus: EventBus) {}

  async execute(
    command: DeleteTaskCommand,
  ): Promise<DeleteTaskCommandHandlerResult> {
    const { input } = command;

    await this.tasksService.deleteTask(input.id);

    const event = new TaskDeletedEvent(input, {
      ...command.context,
      command: 'delete-task',
    });

    this.eventBus.publish(event);

    return {
      $events: [event],
    };
  }
}
